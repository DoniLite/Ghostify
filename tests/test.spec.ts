

// test('Connexion avec Google', async ({ page }) => {
//   await page.goto('https://ton-domaine.com/login');
//   await page.click('button:has-text("Connectez-vous avec Google")');
//   await page.waitForURL('https://accounts.google.com/**');

//   // Remplir le formulaire Google ici
//   await page.fill('input[type="email"]', 'ton-email@exemple.com');
//   await page.click('button:has-text("Suivant")');

//   // Continuer les étapes de connexion Google...

//   // Vérifier que l'utilisateur est redirigé sur la page d'accueil après connexion
//   await page.waitForURL('https://ton-domaine.com/dashboard');
//   expect(await page.textContent('h1')).toBe('Bienvenue');
// });

// test('Ajouter un article de blog', async ({ page }) => {
//   await page.goto('https://ton-domaine.com/login');
//   // Simuler la connexion, par exemple via cookies ou une méthode personnalisée
//   // await loginWithGoogle(page);

//   await page.goto('https://ton-domaine.com/blog/new');
//   await page.fill('input[name="title"]', 'Mon super article');
//   await page.fill(
//     'textarea[name="content"]',
//     'Voici le contenu de mon article.'
//   );
//   await page.click('button:has-text("Publier")');

//   // Vérifier que l'article est bien publié
//   await page.waitForURL('https://ton-domaine.com/blog/**');
//   expect(await page.textContent('h1')).toBe('Mon super article');
// });

// test('Création de CV', async ({ page }) => {
//   await page.goto('https://ton-domaine.com/login');
//   // Simuler la connexion ou ajouter directement un token

//   await page.goto('https://ton-domaine.com/cv/create');
//   await page.fill('input[name="name"]', 'John Doe');
//   await page.fill('textarea[name="description"]', 'Développeur web passionné.');

//   // Vérifier que le CV est généré
//   await page.click('button:has-text("Générer")');
//   expect(await page.isVisible('text=Votre CV a été généré')).toBeTruthy();
// });

// test('Ajouter une promotion', async ({ page }) => {
//   await page.goto('https://ton-domaine.com/admin/promotions');

//   await page.fill('input[name="title"]', 'Promotion Été 2024');
//   await page.fill(
//     'textarea[name="description"]',
//     'Réduction de 20% sur tous les articles.'
//   );
//   await page.fill('input[name="startDate"]', '2024-06-01T10:00');
//   await page.fill('input[name="endDate"]', '2024-08-31T23:59');
//   await page.click('input[name="isActive"]');

//   // Ajouter la promotion
//   await page.click('button:has-text("Ajouter la Promotion")');

//   // Vérifier que la promotion est bien ajoutée
//   await page.waitForSelector('text=Promotion Été 2024');
//   expect(await page.textContent('tr:has-text("Promotion Été 2024")')).toContain(
//     'Réduction de 20% sur tous les articles'
//   );
// });

// test("Limiter l'utilisation des API", async ({ page }) => {
//   await page.goto('https://ton-domaine.com/login');
//   // Simuler la connexion

//   await page.goto('https://ton-domaine.com/api/usage');

//   // Vérifier qu'il reste des crédits API
//   const apiCredits = await page.textContent('.api-credits');
//   expect(parseInt(apiCredits)).toBeGreaterThan(0);

//   // Effectuer une requête API
//   await page.goto('https://ton-domaine.com/api/use?endpoint=/my-api');

//   // Vérifier que les crédits diminuent
//   const updatedCredits = await page.textContent('.api-credits');
//   expect(parseInt(updatedCredits)).toBeLessThan(parseInt(apiCredits));
// });

// test('Convertir un document', async ({ page }) => {
//   await page.goto('https://ton-domaine.com/converter');

//   // Uploader un fichier
//   const filePath = './tests/files/exemple.pdf';
//   await page.setInputFiles('input[type="file"]', filePath);

//   // Lancer la conversion
//   await page.click('button:has-text("Convertir")');

//   // Vérifier que le fichier est converti et disponible au téléchargement
//   await page.waitForSelector('a.download-link');
//   expect(await page.isVisible('a.download-link')).toBeTruthy();
// });

// test('Supprimer une promotion', async ({ page }) => {
//   await page.goto('https://ton-domaine.com/admin/promotions');

//   // Supposer qu'une promotion est déjà présente
//   await page.click('button:has-text("Supprimer")');

//   // Confirmer la suppression
//   await page.click('button:has-text("Confirmer")');

//   // Vérifier que la promotion n'est plus affichée
//   expect(await page.locator('tr:has-text("Promotion Été 2024")').count()).toBe(
//     0
//   );
// });
