const EnglishTitleText = 'Example Days Off Scheduling App';
const FrenchTitleText = `Exemple d'application de planification des jours de congé`;
const SpanishTitleText = 'Ejemplo de aplicación de programación de días libres';
const sentMessage = { message: 'Testing', name: 'Mr Test', email: 'test@testing.com' };

describe('Menu Section', () => {
    it('Visit the page', () => {
        cy.visit('/')
        cy.get('#title').contains(EnglishTitleText);
    });

    context.skip('Language selection', () => {
        beforeEach(() => {
            cy.get('#selectLanguage').click();
            cy.get('.p-dropdown-label').click();
            cy.get('.p-dropdown-items').as('dropdown');
            cy.get('#title').as('title');
        });

        it('should change to Spanish', () => {
            cy.get('@dropdown').find('.p-dropdown-item').contains('Español').click();
            cy.get('@title').contains(SpanishTitleText);
        });

        it('should change to French', () => {
            cy.get('@dropdown').find('.p-dropdown-item').contains('Française').click();
            cy.get('@title').contains(FrenchTitleText);
        });

        it('should change to English', () => {
            cy.get('@dropdown').find('.p-dropdown-item').contains('English').click();
            cy.get('@title').contains(EnglishTitleText);
        });
    });

    context.skip('Show explanation', () => {
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

    context.skip('Go to GitHub', () => {
        it('should have the correct link', () => {
            cy.get('#toGitHub').should('have.attr', 'href', 'https://github.com/ebakunin/example-days-off-app');
        });
    });

    context('Message me', () => {
        beforeEach(() => {
        });

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
