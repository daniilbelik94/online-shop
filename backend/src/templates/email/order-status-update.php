 <!DOCTYPE html>
 <html lang="en">

 <head>
     <meta charset="utf-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>Order Update - #<?= htmlspecialchars($order['order_number'] ?? 'N/A') ?></title>
     <style>
     * {
         margin: 0;
         padding: 0;
         box-sizing: border-box;
     }

     body {
         font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
         line-height: 1.6;
         color: #333333;
         background-color: #f8f9fa;
     }

     .email-container {
         max-width: 600px;
         margin: 0 auto;
         background-color: #ffffff;
         box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
     }

     .header {
         padding: 40px 30px;
         text-align: center;
         color: white;
     }

     .header.processing {
         background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
     }

     .header.shipped {
         background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
     }

     .header.delivered {
         background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
     }

     .header.cancelled {
         background: linear-gradient(135deg, #fc466b 0%, #3f5efb 100%);
     }

     .header.default {
         background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
     }

     .header h1 {
         font-size: 28px;
         margin-bottom: 10px;
         font-weight: 300;
     }

     .header .subtitle {
         font-size: 16px;
         opacity: 0.9;
     }

     .content {
         padding: 40px 30px;
     }

     .status-info {
         background-color: #f8f9fa;
         border-radius: 8px;
         padding: 25px;
         margin-bottom: 30px;
         text-align: center;
     }

     .status-info.processing {
         border-left: 4px solid #f093fb;
         background-color: #fef7f0;
     }

     .status-info.shipped {
         border-left: 4px solid #4facfe;
         background-color: #f0faff;
     }

     .status-info.delivered {
         border-left: 4px solid #43e97b;
         background-color: #f0fff4;
     }

     .status-info.cancelled {
         border-left: 4px solid #fc466b;
         background-color: #fff0f0;
     }

     .status-badge {
         display: inline-block;
         padding: 8px 20px;
         border-radius: 20px;
         font-weight: 600;
         text-transform: uppercase;
         letter-spacing: 1px;
         margin-bottom: 15px;
     }

     .status-badge.processing {
         background-color: #f093fb;
         color: white;
     }

     .status-badge.shipped {
         background-color: #4facfe;
         color: white;
     }

     .status-badge.delivered {
         background-color: #43e97b;
         color: white;
     }

     .status-badge.cancelled {
         background-color: #fc466b;
         color: white;
     }

     .status-badge.default {
         background-color: #667eea;
         color: white;
     }

     .order-info {
         background-color: #f8f9fa;
         border-radius: 8px;
         padding: 25px;
         margin-bottom: 30px;
         border-left: 4px solid #667eea;
     }

     .order-info h2 {
         color: #667eea;
         margin-bottom: 15px;
         font-size: 20px;
     }

     .order-details {
         display: flex;
         justify-content: space-between;
         flex-wrap: wrap;
         gap: 15px;
     }

     .detail-item {
         flex: 1;
         min-width: 200px;
     }

     .detail-label {
         font-weight: 600;
         color: #666;
         font-size: 14px;
         text-transform: uppercase;
         letter-spacing: 0.5px;
     }

     .detail-value {
         font-size: 16px;
         color: #333;
         margin-top: 2px;
     }

     .progress-tracker {
         background-color: #f8f9fa;
         border-radius: 8px;
         padding: 25px;
         margin: 30px 0;
     }

     .progress-steps {
         display: flex;
         justify-content: space-between;
         position: relative;
         margin: 20px 0;
     }

     .progress-line {
         position: absolute;
         top: 15px;
         left: 0;
         right: 0;
         height: 2px;
         background-color: #e0e0e0;
         z-index: 1;
     }

     .progress-step {
         background-color: white;
         border: 2px solid #e0e0e0;
         border-radius: 50%;
         width: 30px;
         height: 30px;
         display: flex;
         align-items: center;
         justify-content: center;
         z-index: 2;
         position: relative;
     }

     .progress-step.completed {
         background-color: #4caf50;
         border-color: #4caf50;
         color: white;
     }

     .progress-step.current {
         background-color: #667eea;
         border-color: #667eea;
         color: white;
     }

     .step-label {
         text-align: center;
         margin-top: 10px;
         font-size: 12px;
         color: #666;
         font-weight: 600;
     }

     .action-buttons {
         text-align: center;
         margin: 30px 0;
     }

     .btn {
         display: inline-block;
         padding: 12px 30px;
         background-color: #667eea;
         color: white;
         text-decoration: none;
         border-radius: 6px;
         font-weight: 600;
         margin: 0 10px;
     }

     .btn.secondary {
         background-color: transparent;
         color: #667eea;
         border: 2px solid #667eea;
     }

     .footer {
         background-color: #2c3e50;
         color: white;
         text-align: center;
         padding: 30px;
     }

     .footer h3 {
         margin-bottom: 15px;
         color: #ecf0f1;
     }

     .footer p {
         margin-bottom: 10px;
         opacity: 0.8;
     }

     @media (max-width: 600px) {
         .email-container {
             margin: 0;
             border-radius: 0;
         }

         .header,
         .content,
         .footer {
             padding: 20px;
         }

         .order-details {
             flex-direction: column;
         }

         .detail-item {
             margin-bottom: 15px;
         }

         .progress-steps {
             flex-direction: column;
             gap: 20px;
         }

         .progress-line {
             display: none;
         }

         .btn {
             display: block;
             margin: 10px 0;
         }
     }
     </style>
 </head>

 <body>
     <?php
        $status = $order['status'] ?? 'pending';
        $statusClass = in_array($status, ['processing', 'shipped', 'delivered', 'cancelled']) ? $status : 'default';
        ?>

     <div class="email-container">
         <!-- Header -->
         <div class="header <?= $statusClass ?>">
             <h1>Order Update</h1>
             <p class="subtitle"><?= htmlspecialchars($status_message ?? 'Your order status has been updated') ?></p>
         </div>

         <!-- Content -->
         <div class="content">
             <!-- Status Information -->
             <div class="status-info <?= $statusClass ?>">
                 <div class="status-badge <?= $statusClass ?>"><?= ucfirst($status) ?></div>
                 <h2>Order #<?= htmlspecialchars($order['order_number'] ?? 'N/A') ?></h2>
                 <p style="color: #666; margin-top: 10px;">
                     <?php
                        switch ($status) {
                            case 'processing':
                                echo 'Your order is now being processed and will be shipped soon.';
                                break;
                            case 'shipped':
                                echo 'Great news! Your order is on its way to you.';
                                break;
                            case 'delivered':
                                echo 'Your order has been successfully delivered!';
                                break;
                            case 'cancelled':
                                echo 'Your order has been cancelled as requested.';
                                break;
                            default:
                                echo 'Your order status has been updated.';
                        }
                        ?>
                 </p>
             </div>

             <!-- Order Information -->
             <div class="order-info">
                 <h2>Order Details</h2>
                 <div class="order-details">
                     <div class="detail-item">
                         <div class="detail-label">Order Number</div>
                         <div class="detail-value">#<?= htmlspecialchars($order['order_number'] ?? 'N/A') ?></div>
                     </div>
                     <div class="detail-item">
                         <div class="detail-label">Order Date</div>
                         <div class="detail-value">
                             <?= htmlspecialchars(date('F j, Y', strtotime($order['created_at'] ?? 'now'))) ?></div>
                     </div>
                     <div class="detail-item">
                         <div class="detail-label">Total Amount</div>
                         <div class="detail-value">$<?= number_format($order['total_amount'] ?? 0, 2) ?></div>
                     </div>
                 </div>
             </div>

             <!-- Progress Tracker -->
             <?php if ($status !== 'cancelled'): ?>
             <div class="progress-tracker">
                 <h3 style="margin-bottom: 20px; color: #333;">Order Progress</h3>
                 <div class="progress-steps">
                     <div style="text-align: center; flex: 1;">
                         <div class="progress-step completed">✓</div>
                         <div class="step-label">Order Placed</div>
                     </div>
                     <div style="text-align: center; flex: 1;">
                         <div
                             class="progress-step <?= in_array($status, ['processing', 'shipped', 'delivered']) ? 'completed' : ($status === 'pending' ? 'current' : '') ?>">
                             <?= in_array($status, ['processing', 'shipped', 'delivered']) ? '✓' : '2' ?>
                         </div>
                         <div class="step-label">Processing</div>
                     </div>
                     <div style="text-align: center; flex: 1;">
                         <div
                             class="progress-step <?= in_array($status, ['shipped', 'delivered']) ? 'completed' : ($status === 'processing' ? 'current' : '') ?>">
                             <?= in_array($status, ['shipped', 'delivered']) ? '✓' : '3' ?>
                         </div>
                         <div class="step-label">Shipped</div>
                     </div>
                     <div style="text-align: center; flex: 1;">
                         <div
                             class="progress-step <?= $status === 'delivered' ? 'completed' : ($status === 'shipped' ? 'current' : '') ?>">
                             <?= $status === 'delivered' ? '✓' : '4' ?>
                         </div>
                         <div class="step-label">Delivered</div>
                     </div>
                 </div>
             </div>
             <?php endif; ?>

             <!-- Additional Information based on status -->
             <?php if ($status === 'shipped'): ?>
             <div
                 style="background-color: #e8f4fd; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #b3d9f2;">
                 <h3 style="color: #1976d2; margin-bottom: 10px;">Shipping Information</h3>
                 <p>Your order is now on its way! You should receive it within the next few business days.</p>
                 <?php if (!empty($order['shipping_method'])): ?>
                 <p><strong>Shipping Method:</strong> <?= htmlspecialchars($order['shipping_method']) ?></p>
                 <?php endif; ?>
             </div>
             <?php elseif ($status === 'delivered'): ?>
             <div
                 style="background-color: #f0fff4; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #b3d9b3;">
                 <h3 style="color: #2e7d32; margin-bottom: 10px;">Delivery Confirmation</h3>
                 <p>Your order has been successfully delivered! We hope you love your purchase.</p>
                 <p style="margin-top: 15px;">If you have any issues with your order, please don't hesitate to contact
                     our support team.</p>
             </div>
             <?php elseif ($status === 'cancelled'): ?>
             <div
                 style="background-color: #fff0f0; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #ffb3b3;">
                 <h3 style="color: #d32f2f; margin-bottom: 10px;">Order Cancelled</h3>
                 <p>Your order has been cancelled as requested. If this was a paid order, any charges will be refunded
                     within 3-5 business days.</p>
                 <p style="margin-top: 15px;">If you have any questions about this cancellation, please contact our
                     support team.</p>
             </div>
             <?php endif; ?>

             <!-- Action Buttons -->
             <div class="action-buttons">
                 <?php if ($status !== 'cancelled'): ?>
                 <a href="#" class="btn">Track Order</a>
                 <?php endif; ?>
                 <a href="#" class="btn secondary">Contact Support</a>
             </div>
         </div>

         <!-- Footer -->
         <div class="footer">
             <h3>Thank You!</h3>
             <p>We appreciate your business and are here to help if you need anything.</p>

             <div style="margin-top: 20px;">
                 <a href="#" style="color: #ecf0f1; text-decoration: none; margin: 0 10px; opacity: 0.8;">Support</a> |
                 <a href="#" style="color: #ecf0f1; text-decoration: none; margin: 0 10px; opacity: 0.8;">Track
                     Order</a> |
                 <a href="#" style="color: #ecf0f1; text-decoration: none; margin: 0 10px; opacity: 0.8;">Return
                     Policy</a>
             </div>
         </div>
     </div>
 </body>

 </html>