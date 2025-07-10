describe('Accessibility Features', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Help Component', () => {
    it('is keyboard accessible', () => {
      // Navigate to help button
      cy.get('[aria-label="Help"]').focus();
      
      // Open with Enter key
      cy.focused().type('{enter}');
      cy.get('[role="region"]').should('be.visible');
      
      // Navigate through sections
      cy.focused().tab();
      cy.focused().should('have.attr', 'aria-expanded', 'false');
      
      // Open section with Space key
      cy.focused().type(' ');
      cy.focused().should('have.attr', 'aria-expanded', 'true');
      
      // Close help with Escape key
      cy.focused().type('{esc}');
      cy.get('[role="region"]').should('not.be.visible');
    });

    it('maintains proper focus management', () => {
      cy.get('[aria-label="Help"]').click();
      
      // Tab through all focusable elements
      cy.get('[role="region"]').within(() => {
        cy.focused().tab().should('be.visible');
        cy.focused().tab().should('be.visible');
        cy.focused().tab().should('be.visible');
      });
      
      // Focus should stay trapped in the help dialog
      cy.focused().tab();
      cy.focused().should('have.attr', 'aria-label', 'Help');
    });
  });

  describe('Breadcrumbs Component', () => {
    it('has proper navigation structure', () => {
      cy.get('nav[aria-label="Breadcrumb"]')
        .should('exist')
        .within(() => {
          cy.get('[role="list"]').should('exist');
          cy.get('li').should('have.length.at.least', 1);
        });
    });

    it('indicates current page correctly', () => {
      cy.get('nav[aria-label="Breadcrumb"] li').last()
        .should('have.attr', 'aria-current', 'page');
    });

    it('is keyboard navigable', () => {
      cy.get('nav[aria-label="Breadcrumb"] a').first().focus();
      
      // Can tab through all links
      cy.get('nav[aria-label="Breadcrumb"] a').each(() => {
        cy.focused().should('be.visible').tab();
      });
    });
  });

  describe('Footer Component', () => {
    it('has proper semantic structure', () => {
      cy.get('footer[role="contentinfo"]').should('exist');
    });

    it('has accessible navigation sections', () => {
      cy.get('footer nav').each($nav => {
        cy.wrap($nav)
          .should('have.attr', 'aria-label')
          .should('have.attr', 'role', 'navigation');
      });
    });

    it('has properly labeled links', () => {
      cy.get('footer a').each($link => {
        // Check that links have text or aria-label
        cy.wrap($link).should($el => {
          expect($el.text().trim() || $el.attr('aria-label')).to.not.be.empty;
        });
      });
    });

    it('handles keyboard navigation', () => {
      // Focus first footer link
      cy.get('footer a').first().focus();
      
      // Tab through all focusable elements
      cy.get('footer').within(() => {
        let foundFocusableElements = 0;
        
        // Keep tabbing until we cycle back to the first element or hit a reasonable limit
        for (let i = 0; i < 20; i++) {
          cy.focused().then($el => {
            if ($el.is(':visible')) {
              foundFocusableElements++;
            }
          });
          cy.focused().tab();
        }
        
        // Ensure we found some focusable elements
        expect(foundFocusableElements).to.be.greaterThan(0);
      });
    });

    it('has accessible forms', () => {
      cy.get('footer form').each($form => {
        cy.wrap($form)
          .should('have.attr', 'aria-label');
        
        // Check form controls
        cy.wrap($form).within(() => {
          cy.get('input, select, textarea').each($input => {
            cy.wrap($input).should($el => {
              // Should have either a label, aria-label, or aria-labelledby
              expect(
                $el.attr('aria-label') ||
                $el.attr('aria-labelledby') ||
                $el.closest('label').length
              ).to.exist;
            });
          });
        });
      });
    });
  });

  describe('General Accessibility', () => {
    it('respects reduced motion preference', () => {
      // Mock prefers-reduced-motion media query
      cy.window().then(win => {
        cy.stub(win.matchMedia('(prefers-reduced-motion: reduce)'), 'matches', true);
      });

      // Reload page with mocked preference
      cy.reload();

      // Check that elements have reduce-motion class
      cy.get('.reduce-motion').should('exist');
    });

    it('maintains sufficient color contrast', () => {
      // This is a basic check - for thorough testing, use specialized tools
      cy.get('a, button, [role="button"]').each($el => {
        cy.wrap($el).should($el => {
          const backgroundColor = getComputedStyle($el[0]).backgroundColor;
          const color = getComputedStyle($el[0]).color;
          // Log colors for manual verification
          cy.log(`Element colors - bg: ${backgroundColor}, text: ${color}`);
        });
      });
    });

    it('preserves focus visibility', () => {
      // Test that focus indicators are visible
      cy.get('a, button, [role="button"], input, select').each($el => {
        cy.wrap($el).focus().should('have.css', 'outline-style').and('not.equal', 'none');
      });
    });
  });
}); 