Feature: nopCommerce Homepage - Featured Products
  As a user
  I want to see featured products on the homepage
  So that I can add them to my cart

  Background:
    Given I open the nopCommerce homepage

  @run
  Scenario: Display ADD TO CART buttons for each featured product
    Then I should see "ADD TO CART" buttons for each featured product
    And the total number of "ADD TO CART" buttons should be greater than 0

  Scenario: List all featured product names
    Then I should see a list of featured product names
    And the number of products should be greater than 0

  Scenario: Match product count between items and ADD TO CART buttons
    Then the product count should match the "ADD TO CART" button count

  Scenario: Display product details with name, price, and cart button
    Then I should see product details including name, price, and cart button
