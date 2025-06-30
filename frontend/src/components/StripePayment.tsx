import React from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button, Alert, Box, Typography } from "@mui/material";

interface StripePaymentProps {
  amount: number;
  onSuccess: (paymentIntent: any) => void;
  onError: (error: string) => void;
  disabled?: boolean;
}

const StripePayment: React.FC<StripePaymentProps> = ({
  amount,
  onSuccess,
  onError,
  disabled = false,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string>("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Создать payment intent на бэкенде
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
      const response = await fetch(`${apiUrl}/payments/create-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ 
          amount: Math.round(amount * 100), // Конвертируем в центы
          user_id: localStorage.getItem("userId")
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create payment intent");
      }

      const { clientSecret } = await response.json();

      // Подтвердить платеж
      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement)!,
          },
        });

      if (stripeError) {
        setError(stripeError.message || "Payment failed");
        onError(stripeError.message || "Payment failed");
      } else {
        onSuccess(paymentIntent);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Payment failed. Please try again.";
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
      <Typography variant="h6" gutterBottom>
        Payment Information
      </Typography>
      
      <Box sx={{ mb: 2, p: 2, border: "1px solid #e0e0e0", borderRadius: 1 }}>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={!stripe || loading || disabled}
        sx={{ mt: 2 }}
      >
        {loading ? "Processing..." : `Pay $${amount.toFixed(2)}`}
      </Button>
    </Box>
  );
};

export default StripePayment; 