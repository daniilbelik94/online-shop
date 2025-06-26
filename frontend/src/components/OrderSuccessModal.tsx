import React from 'react';
import { useNavigate } from 'react-router-dom';

interface OrderSuccessModalProps {
  open: boolean;
  onClose: () => void;
  orderData?: {
    orderNumber: string;
    total: number;
    email: string;
  } | null;
}

const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  open,
  onClose,
  orderData,
}) => {
  const navigate = useNavigate();

  const handleViewOrders = () => {
    onClose();
    navigate('/profile?tab=orders');
  };

  const handleContinueShopping = () => {
    onClose();
    navigate('/products');
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  console.log('OrderSuccessModal render:', { open, orderData });
  console.log('Modal should be visible:', open);
  console.log('DOM body element exists:', !!document.body);

  if (!open) {
    console.log('Modal is closed, not rendering');
    return null;
  }

  console.log('Modal is open, rendering modal...');

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-50px) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
          }
          70% {
            box-shadow: 0 0 0 20px rgba(76, 175, 80, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
          }
        }
      `}</style>
      
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          zIndex: 2147483647,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
        }}
        onClick={(e) => {
          e.stopPropagation();
          console.log('Backdrop clicked - modal stays open');
        }}
      >
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            maxWidth: '550px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            animation: 'slideIn 0.3s ease-out',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              right: '16px',
              top: '16px',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              zIndex: 10,
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            }}
          >
            ✕
          </button>

          <div style={{ padding: '40px', textAlign: 'center' }}>
            {/* Success Icon with animation */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                backgroundColor: '#4caf50',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                animation: 'pulse 2s infinite',
              }}>
                <div style={{ 
                  fontSize: '60px',
                  color: 'white'
                }}>
                  ✓
                </div>
              </div>
            </div>

            {/* Success Message */}
            <h2 style={{
              fontSize: '32px',
              fontWeight: 700,
              color: '#2e7d32',
              marginBottom: '12px',
            }}>
              Order Placed Successfully!
            </h2>
            
            <div style={{ fontSize: '20px', marginBottom: '8px' }}>
              🎉
            </div>

            <p style={{
              fontSize: '16px',
              color: '#666',
              marginBottom: '32px',
              lineHeight: 1.6,
            }}>
              Thank you for your order! We've received your payment and will start
              processing your order right away.
            </p>

            {/* Order Details Card */}
            {orderData && (
              <div style={{
                marginBottom: '32px',
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                border: '1px solid #dee2e6',
                borderRadius: '16px',
                padding: '28px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, #4caf50, #2196f3, #9c27b0)',
                }}></div>
                
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '20px',
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#2e7d32'
                }}>
                  📋 Order Details
                </div>
                
                <div style={{ textAlign: 'left' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginBottom: '8px' 
                  }}>
                    <span style={{ color: '#666' }}>Order Number:</span>
                    <span style={{ fontWeight: 600 }}>{orderData.orderNumber}</span>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginBottom: '8px' 
                  }}>
                    <span style={{ color: '#666' }}>Total Amount:</span>
                    <span style={{ fontWeight: 600, color: '#1976d2' }}>
                      {formatPrice(orderData.total)}
                    </span>
                  </div>

                  <hr style={{ 
                    margin: '16px 0', 
                    border: 'none', 
                    borderTop: '1px solid #e0e0e0' 
                  }} />

                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '8px' }}>📧</span>
                    <span style={{ color: '#666', fontSize: '14px' }}>
                      Confirmation email sent to: {orderData.email}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ 
              display: 'flex', 
              gap: '16px', 
              justifyContent: 'center',
              marginBottom: '8px'
            }}>
              <button
                onClick={handleViewOrders}
                style={{
                  padding: '14px 28px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(25, 118, 210, 0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(25, 118, 210, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(25, 118, 210, 0.3)';
                }}
              >
                🛍️ View My Orders
              </button>
              
              <button
                onClick={handleContinueShopping}
                style={{
                  padding: '14px 28px',
                  borderRadius: '12px',
                  border: '2px solid #1976d2',
                  backgroundColor: 'white',
                  color: '#1976d2',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#1976d2';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.color = '#1976d2';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Continue Shopping
              </button>
            </div>

            {/* Additional Info */}
            <p style={{
              marginTop: '24px',
              fontSize: '12px',
              color: '#666',
              lineHeight: 1.4,
            }}>
              You can track your order status in your profile page.
              <br />
              We'll send you updates via email as your order progresses.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderSuccessModal; 