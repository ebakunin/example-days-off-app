const EnglishTitleText = 'Example Days Off Scheduling App';
const FrenchTitleText = `Exemple d'application de planification des jours de congé`;
const SpanishTitleText = 'Ejemplo de aplicación de programación de días libres';
const sentMessage = { message: 'Testing', name: 'Mr Test', email: 'test@testing.com' };

describe('Menu Section', () => {
    it('Visit the page', () => {
        cy.visit('/')
        cy.get('#title').contains(EnglishTitleText);
    });

    context('Language selection', () => {
        beforeEach(() => {
            cy.get('#selectLanguage').click();
            cy.get('#languageDropdown .p-dropdown').as('dropdown');
            cy.get('@dropdown').trigger('click');
        });

        it('should change to Spanish', () => {
            cy.get('@dropdown').find('ul li').contains('Español').trigger('click');
            cy.get('#title').contains(SpanishTitleText);
        });

        it('should change to French', () => {
            cy.get('@dropdown').find('ul li').contains('Française').trigger('click');
            cy.get('#title').contains(FrenchTitleText);
        });

        it('should change to English', () => {
            cy.get('@dropdown').find('ul li').contains('English').trigger('click');
            cy.get('#title').contains(EnglishTitleText);
        });
    });

    context('Show explanation', () => {
        it('should show first container', () => {
            cy.get('#showExplanation').click();
            cy.get('.mesh').should('exist');
            cy.get('#explanation1').should('be.visible');
        });

        it('should show and hide all containers', () => {
            cy.get('#explanation1 i').trigger('click').should('not.be.visible');
            cy.get('#explanation2 i').trigger('click').should('not.be.visible');
            cy.get('#explanation3 i').trigger('click').should('not.be.visible');
            cy.get('#explanation4 i').trigger('click').should('not.be.visible');
            cy.get('.mesh').should('not.exist');
        });
    });

    context('Go to GitHub', () => {
        it('should have the correct link', () => {
            cy.get('#toGitHub').should('have.attr', 'href', 'https://github.com/ebakunin/example-days-off-app');
        });
    });

    context('Message me', () => {
        it('should show the dialog box', () => {
            cy.get('#sendMessage').trigger('click');
            cy.get('p-dialog').should('exist');
        });

        it('should incorrectly populate the form', () => {
            cy.get('#yourMessage').type(sentMessage.message);
            cy.get('#yourName').type(sentMessage.name);
            cy.get('#yourEmail').type('foo').blur().should('have.class', 'ng-invalid');
            cy.get('#sendButton').should('have.attr', 'disabled');
        });

        it('should correctly populate the form', () => {
            cy.get('#yourEmail').clear();
            cy.get('#yourEmail').type(sentMessage.email).blur();
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
                + '&sentMessage=' + encodeURIComponent(sentMessage.email);

            cy.wait('@getSendMessage').its('request.body').should('deep.equal', body);
        });

        it('should show a toast notification', () => {
            cy.get('.p-toast-message-success').should('be.visible');
        });
    });
});
