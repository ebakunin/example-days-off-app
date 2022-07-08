
describe('Menu Section', () => {
    let EnglishTitle: string;
    let SpanishTitle: string;
    let FrenchTitle: string;

    it('Load translations', () => {
        cy.fixture('../../src/assets/i18n/en-US.json').then((data) => EnglishTitle = data.DAYS_OFF.MAIN.TITLE);
        cy.fixture('../../src/assets/i18n/es-ES.json').then((data) => SpanishTitle = data.DAYS_OFF.MAIN.TITLE);
        cy.fixture('../../src/assets/i18n/fr-FR.json').then((data) => FrenchTitle = data.DAYS_OFF.MAIN.TITLE);
    });

    it('Visit the page', () => {
        cy.visit('/')
        cy.get('#title').contains(EnglishTitle);
    });

    context('Toggle dark mode', () => {
        it('should switch to dark mode', () => {
            cy.get('#selectTheme').click();
            cy.get('body').should('have.attr', 'data-theme', 'dark');
        });

        it('should switch back to light mode', () => {
            cy.get('#selectTheme').click();
            cy.get('body').should('have.attr', 'data-theme', '');
        });
    });

    context('Language selection', () => {
        beforeEach(() => {
            cy.get('#selectLanguage').click();
            cy.get('.p-dropdown-label').click();
            cy.get('.p-dropdown-items').as('dropdown');
            cy.get('#title').as('title');
        });

        it('should change to Spanish', () => {
            cy.get('@dropdown').find('.p-dropdown-item').contains('Español').click();
            cy.get('@title').contains(SpanishTitle);
        });

        it('should change to French', () => {
            cy.get('@dropdown').find('.p-dropdown-item').contains('Française').click();
            cy.get('@title').contains(FrenchTitle);
        });

        it('should change to English', () => {
            cy.get('@dropdown').find('.p-dropdown-item').contains('English').click();
            cy.get('@title').contains(EnglishTitle);
        });
    });

    context('Show explanation', () => {
        it('should show first container', () => {
            cy.get('#showExplanation').click();
            cy.get('.mesh').should('exist');
            cy.get('#explanation1').should('be.visible');
        });

        it('should show and hide all containers', () => {
            cy.get('#explanation1 i').click().should('not.be.visible');
            cy.get('#explanation2 i').click().should('not.be.visible');
            cy.get('#explanation3 i').click().should('not.be.visible');
            cy.get('#explanation4 i').click().should('not.be.visible');
            cy.get('.mesh').should('not.exist');
        });
    });

    context('Go to GitHub', () => {
        it('should have the correct link', () => {
            cy.get('#toGitHub').should('have.attr', 'href', 'https://github.com/ebakunin/example-days-off-app');
        });
    });

    context('Message me', () => {
        const sentMessage = {
            message: 'Testing',
            name: 'Mr Test',
            email: 'test@testing.com'
        };

        it('should show the dialog box', () => {
            cy.get('#sendMessage').click();
            cy.get('p-dialog').should('exist');
        });

        it('should incorrectly populate the form', () => {
            cy.get('#yourMessage').type(sentMessage.message);
            cy.get('#yourName').type(sentMessage.name);
            cy.get('#yourEmail').type('foo').blur().should('have.class', 'ng-invalid');
            cy.get('#sendButton').should('have.attr', 'disabled');
        });

        it('should correctly populate the form', () => {
            cy.get('#yourEmail').clear().type(sentMessage.email).blur();
            cy.get('#sendButton').should('not.have.attr', 'disabled');
        });

        it('should send the message', () => {
            cy.get('#sendButton').click();

            cy.intercept(
                { method: 'POST', url: 'http://www.ericchristenson.com/message' },
                { body: {response: 200, message: 'Success'} }
            ).as('getSendMessage');

            const body = 'message=' + encodeURIComponent(sentMessage.message)
                + '&name=' + encodeURIComponent(sentMessage.name)
                + '&email=' + encodeURIComponent(sentMessage.email);

            cy.wait('@getSendMessage').its('request.body').should('deep.equal', body);
        });

        it('should show a toast notification', () => {
            cy.get('.p-toast-message-success').should('be.visible');
        });
    });
});
