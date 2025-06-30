import React from "react";
import { render, screen } from "@testing-library/react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import StripePayment from "../StripePayment";

// Mock Stripe
const mockStripe = loadStripe("pk_test_...");

const renderWithStripe = (component: React.ReactElement) => {
  return render(
    <Elements stripe={mockStripe}>
      {component}
    </Elements>
  );
};

describe("StripePayment", () => {
  const mockOnSuccess = jest.fn();
  const mockOnError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders payment form", () => {
    renderWithStripe(
      <StripePayment
        amount={99.99}
        onSuccess={mockOnSuccess}
        onError={mockOnError}
      />
    );

    expect(screen.getByText("Payment Information")).toBeInTheDocument();
    expect(screen.getByText("Pay $99.99")).toBeInTheDocument();
  });

  test("renders with disabled state", () => {
    renderWithStripe(
      <StripePayment
        amount={99.99}
        onSuccess={mockOnSuccess}
        onError={mockOnError}
        disabled={true}
      />
    );

    const payButton = screen.getByText("Pay $99.99");
    expect(payButton).toBeDisabled();
  });

  test("renders with different amounts", () => {
    renderWithStripe(
      <StripePayment
        amount={149.50}
        onSuccess={mockOnSuccess}
        onError={mockOnError}
      />
    );

    expect(screen.getByText("Pay $149.50")).toBeInTheDocument();
  });
}); 