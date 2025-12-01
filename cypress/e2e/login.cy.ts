describe("Login Process", () => {
  it("should log in a valid user and redirect to the dashboard", () => {
    // 1. Visitar la página de login
    cy.visit("/auth/login"); // Cypress añadirá automáticamente el baseUrl

    // 2. Encontrar los campos y el botón (¡Usa selectores robustos!)
    // RECOMENDACIÓN: Añade atributos `data-testid` a tus elementos HTML
    // Ejemplo: <input data-testid="email-input" ... />
    const emailInput = cy.get('[data-testid="email-input"]');
    const passwordInput = cy.get('[data-testid="password-input"]');
    const submitButton = cy.get('button[type="submit"]');

    // 3. Escribir las credenciales (usa un usuario de prueba válido)
    emailInput.type("weakban+psico@gmail.com"); // Reemplaza con un email de prueba
    passwordInput.type("12345678"); // Reemplaza con la contraseña de prueba

    // 4. Hacer clic en el botón de submit
    submitButton.click();

    // 5. Verificar la redirección (ajusta la URL esperada)
    // Debería redirigir a una ruta protegida, como el dashboard o la lista de servicios
    cy.url().should("include", "/app"); // O '/app/services', '/dashboard', etc.

    // 6. (Opcional) Verificar que algún elemento del dashboard esté visible
    // cy.contains('Bienvenido, Carlos Sánchez').should('be.visible'); // Busca texto específico
    cy.get('[data-testid="user-avatar"]').should("be.visible"); // Busca un elemento específico del layout autenticado
  });

  it("should display an error message for invalid credentials", () => {
    cy.visit("/auth/login");

    cy.get('[data-testid="email-input"]').type("correo-invalido@test.com");
    cy.get('[data-testid="password-input"]').type("contraseñaincorrecta");
    cy.get('button[type="submit"]').click();

    // Verificar que aparezca un mensaje de error (ajusta el selector y el texto)
    cy.get('[data-testid="error-message"]')
      .should("be.visible")
      .and("contain.text", "Credenciales inválidas"); // O el texto exacto del error
    cy.url().should("include", "/auth/login"); // Verificar que no redirigió
  });
});
