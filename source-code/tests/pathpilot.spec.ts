import { test, expect, type Page } from '@playwright/test';

const CRITICAL_RESOURCE_TYPES = new Set(['document', 'script', 'stylesheet', 'xhr', 'fetch']);
const ROUTES = [
  '/dashboard',
  '/profile',
  '/diagnostic',
  '/competency',
  '/training',
  '/materials',
  '/mcq-generator',
  '/assessment',
  '/roadmap',
  '/learning',
  '/practice',
  '/gap',
  '/repair',
  '/verification',
  '/progress',
  '/admin',
  '/settings',
];

function attachRuntimeGuards(page: Page) {
  const pageErrors: string[] = [];
  const consoleErrors: string[] = [];
  const failedCriticalRequests: string[] = [];

  page.on('pageerror', error => pageErrors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('requestfailed', request => {
    const resourceType = request.resourceType();
    const url = request.url();
    if (CRITICAL_RESOURCE_TYPES.has(resourceType) && !url.includes('favicon')) {
      failedCriticalRequests.push(`${resourceType}: ${url} (${request.failure()?.errorText ?? 'unknown'})`);
    }
  });

  return async () => {
    expect(pageErrors, `Uncaught page errors:\n${pageErrors.join('\n')}`).toEqual([]);
    expect(consoleErrors, `Console errors:\n${consoleErrors.join('\n')}`).toEqual([]);
    expect(
      failedCriticalRequests,
      `Failed critical requests:\n${failedCriticalRequests.join('\n')}`,
    ).toEqual([]);
  };
}

async function expectApplicationShell(page: Page) {
  await expect(page.getByTestId('brand-pathpilot')).toBeVisible();
  await expect(page.getByTestId('adaptive-loop')).toBeVisible();
  await expect(page.locator('body')).not.toContainText(/Internal Server Error|Cannot GET|404 Not Found|Vite.*error/i);
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.clear());
});

test('complete SIH Judge Demo adaptive competency flow', async ({ page }) => {
  const assertRuntimeClean = attachRuntimeGuards(page);

  await page.goto('/');
  await expect(page.getByTestId('brand-pathpilot')).toBeVisible();
  await expect(page.getByTestId('button-landing-sih-demo')).toBeVisible();
  await page.getByTestId('button-landing-sih-demo').click();
  await expect(page).toHaveURL(/\/competency$/);
  await expectApplicationShell(page);

  // Verify the loaded fictional/demo persona through the existing profile screen.
  await page.goto('/profile');
  await expect(page.getByTestId('page-profile')).toBeVisible();
  await expect(page.getByTestId('input-profile-name')).toHaveValue('Dr. Rajesh Sharma');
  await expect(page.getByTestId('input-profile-designation')).toHaveValue('Senior Statistical Officer');
  await expect(page.getByTestId('select-profile-department')).toHaveValue('National Accounts Division (NAD)');
  await expect(page.getByTestId('select-profile-target-role')).toHaveValue('stat_analyst');

  await page.goto('/competency');
  const sqlCard = page.getByTestId('competency-card-tech_sql');
  await expect(sqlCard).toBeVisible();
  await expect(sqlCard).toContainText('SQL & Database Querying');
  await expect(sqlCard).toContainText('Current Demonstrated: 38%');
  await expect(sqlCard).toContainText('Required: 70%');
  await expect(sqlCard).toContainText('Competency Gap: 32 points');
  await expect(sqlCard).toContainText('High Priority');

  // State must survive ordinary client-side navigation.
  await page.getByTestId('link-training').click();
  await expect(page).toHaveURL(/\/training$/);
  await expect(page.getByTestId('course-card-igot_sql_101')).toBeVisible();
  await expect(page.getByTestId('course-card-igot_sql_101')).toContainText('SQL & Relational Database Querying for Official Statistics');
  await expect(page.getByTestId('course-card-igot_sql_101')).toContainText('-32pt gap');

  await page.getByTestId('button-start-course-igot_sql_101').click();
  await expect(page).toHaveURL(/\/roadmap$/);
  await expectApplicationShell(page);

  // Use the real preloaded SQL learning material and assessment-generation flow.
  await page.getByTestId('link-materials').click();
  await expect(page).toHaveURL(/\/materials$/);
  await expect(page.getByTestId('page-material-upload')).toBeVisible();
  await expect(page.getByTestId('page-material-upload')).toContainText('SQL Fundamentals for Official Data Analysis');
  await page.getByTestId('button-generate-mcqs').click();
  await expect(page).toHaveURL(/\/mcq-generator$/);
  await expect(page.getByTestId('page-mcq-generator')).toBeVisible();
  await expect(page.getByText('4 Questions')).toBeVisible();

  await page.getByTestId('button-publish-quiz').click();
  await expect(page).toHaveURL(/\/assessment$/);
  await expect(page.getByTestId('page-assessment')).toBeVisible();

  // The real SQL demo quiz has four questions. Answer three correctly and one incorrectly => 75%.
  const answers = [
    ['q_sql_1', /WHERE/],
    ['q_sql_2', /LEFT OUTER JOIN/],
    ['q_sql_3', /SUM\(\)/],
    ['q_sql_4', /compressing stored data on disk/], // intentional incorrect answer
  ] as const;

  for (const [questionId, option] of answers) {
    await page.getByTestId(`mcq-card-${questionId}`).getByRole('button', { name: option }).click();
  }

  await page.getByTestId('button-submit-assessment').click();
  await expect(page.getByTestId('assessment-results')).toBeVisible();
  await expect(page.getByTestId('assessment-results')).toContainText('75%');
  await expect(page.getByTestId('assessment-results')).toContainText('Before: 38%');
  await expect(page.getByTestId('assessment-results')).toContainText('After: 49%');

  // Verify the competency and gap are recalculated from the updated central state.
  await page.getByRole('button', { name: 'View Updated Competency Profile' }).click();
  await expect(page).toHaveURL(/\/competency$/);
  const updatedSqlCard = page.getByTestId('competency-card-tech_sql');
  await expect(updatedSqlCard).toContainText('Current Demonstrated: 49%');
  await expect(updatedSqlCard).toContainText('Required: 70%');
  await expect(updatedSqlCard).toContainText('Competency Gap: 21 points');
  await expect(updatedSqlCard).toContainText('High Priority');

  // Recommendation engine must recalculate against the new 49% competency signal.
  await page.getByTestId('link-training').click();
  await expect(page).toHaveURL(/\/training$/);
  const updatedCourse = page.getByTestId('course-card-igot_sql_101');
  await expect(updatedCourse).toBeVisible();
  await expect(updatedCourse).toContainText('-21pt gap');
  await expect(page.getByTestId('adaptive-loop')).toContainText('The PathPilot 7-Stage Adaptive Loop');
  for (const label of ['Diagnostic', 'Personalization', 'Performance', 'Knowledge Gap', 'Prerequisite Repair', 'Mastery Verification', 'Adaptive Roadmap']) {
    await expect(page.getByTestId('adaptive-loop')).toContainText(label);
  }

  // Existing reset control must restore the original Judge Demo state.
  await page.getByTestId('button-reset-demo').click();
  await expect(page).toHaveURL(/\/competency$/);
  const resetSqlCard = page.getByTestId('competency-card-tech_sql');
  await expect(resetSqlCard).toContainText('Current Demonstrated: 38%');
  await expect(resetSqlCard).toContainText('Required: 70%');
  await expect(resetSqlCard).toContainText('Competency Gap: 32 points');
  await expect(resetSqlCard).not.toContainText('Current Demonstrated: 49%');
  await expect(resetSqlCard).not.toContainText('Competency Gap: 21 points');

  await assertRuntimeClean();
});

test('important routes load directly with the application shell', async ({ page }) => {
  const assertRuntimeClean = attachRuntimeGuards(page);

  for (const route of ROUTES) {
    await page.goto(route);
    await expectApplicationShell(page);
  }

  await assertRuntimeClean();
});
