import { registerSchema, loginSchema, productSchema, addressSchema, reviewSchema } from '../validation';

describe('Validation Schemas', () => {
  describe('registerSchema', () => {
    test('should validate correct registration data', async () => {
      const validData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'TestPass123!',
        confirmPassword: 'TestPass123!',
        first_name: 'John',
        last_name: 'Doe',
        phone: '+1234567890'
      };

      await expect(registerSchema.validate(validData)).resolves.toEqual(validData);
    });

    test('should reject invalid email', async () => {
      const invalidData = {
        username: 'testuser',
        email: 'invalid-email',
        password: 'TestPass123!',
        confirmPassword: 'TestPass123!',
        first_name: 'John',
        last_name: 'Doe'
      };

      await expect(registerSchema.validate(invalidData)).rejects.toThrow('Please enter a valid email address');
    });

    test('should reject weak password', async () => {
      const invalidData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'weak',
        confirmPassword: 'weak',
        first_name: 'John',
        last_name: 'Doe'
      };

      await expect(registerSchema.validate(invalidData)).rejects.toThrow('Password must be at least 8 characters');
    });

    test('should reject mismatched passwords', async () => {
      const invalidData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'TestPass123!',
        confirmPassword: 'DifferentPass123!',
        first_name: 'John',
        last_name: 'Doe'
      };

      await expect(registerSchema.validate(invalidData)).rejects.toThrow('Passwords must match');
    });

    test('should reject invalid username format', async () => {
      const invalidData = {
        username: 'test-user@',
        email: 'test@example.com',
        password: 'TestPass123!',
        confirmPassword: 'TestPass123!',
        first_name: 'John',
        last_name: 'Doe'
      };

      await expect(registerSchema.validate(invalidData)).rejects.toThrow('Username can only contain letters, numbers and underscores');
    });
  });

  describe('loginSchema', () => {
    test('should validate correct login data', async () => {
      const validData = {
        email: 'test@example.com',
        password: 'TestPass123!'
      };

      await expect(loginSchema.validate(validData)).resolves.toEqual(validData);
    });

    test('should reject missing email', async () => {
      const invalidData = {
        password: 'TestPass123!'
      };

      await expect(loginSchema.validate(invalidData)).rejects.toThrow('Email is required');
    });

    test('should reject missing password', async () => {
      const invalidData = {
        email: 'test@example.com'
      };

      await expect(loginSchema.validate(invalidData)).rejects.toThrow('Password is required');
    });
  });

  describe('productSchema', () => {
    test('should validate correct product data', async () => {
      const validData = {
        name: 'Test Product',
        description: 'This is a test product description that is long enough',
        price: 99.99,
        stock_quantity: 10,
        category_id: 'cat-123'
      };

      await expect(productSchema.validate(validData)).resolves.toEqual(validData);
    });

    test('should reject negative price', async () => {
      const invalidData = {
        name: 'Test Product',
        description: 'This is a test product description',
        price: -10,
        stock_quantity: 10,
        category_id: 'cat-123'
      };

      await expect(productSchema.validate(invalidData)).rejects.toThrow('Price must be positive');
    });

    test('should reject negative stock quantity', async () => {
      const invalidData = {
        name: 'Test Product',
        description: 'This is a test product description',
        price: 99.99,
        stock_quantity: -5,
        category_id: 'cat-123'
      };

      await expect(productSchema.validate(invalidData)).rejects.toThrow('Stock quantity cannot be negative');
    });

    test('should reject short description', async () => {
      const invalidData = {
        name: 'Test Product',
        description: 'Short',
        price: 99.99,
        stock_quantity: 10,
        category_id: 'cat-123'
      };

      await expect(productSchema.validate(invalidData)).rejects.toThrow('Description must be at least 10 characters');
    });
  });

  describe('addressSchema', () => {
    test('should validate correct address data', async () => {
      const validData = {
        name: 'John Doe',
        street: '123 Main Street',
        city: 'New York',
        state: 'NY',
        postal_code: '10001',
        country: 'USA',
        phone: '+1234567890'
      };

      await expect(addressSchema.validate(validData)).resolves.toEqual(validData);
    });

    test('should reject short street address', async () => {
      const invalidData = {
        name: 'John Doe',
        street: '123',
        city: 'New York',
        state: 'NY',
        postal_code: '10001',
        country: 'USA'
      };

      await expect(addressSchema.validate(invalidData)).rejects.toThrow('Street address must be at least 5 characters');
    });

    test('should reject invalid phone format', async () => {
      const invalidData = {
        name: 'John Doe',
        street: '123 Main Street',
        city: 'New York',
        state: 'NY',
        postal_code: '10001',
        country: 'USA',
        phone: 'invalid-phone'
      };

      await expect(addressSchema.validate(invalidData)).rejects.toThrow('Please enter a valid phone number');
    });
  });

  describe('reviewSchema', () => {
    test('should validate correct review data', async () => {
      const validData = {
        rating: 5,
        title: 'Great Product',
        comment: 'This is a detailed review comment that is long enough to meet the minimum requirement.'
      };

      await expect(reviewSchema.validate(validData)).resolves.toEqual(validData);
    });

    test('should reject rating below 1', async () => {
      const invalidData = {
        rating: 0,
        title: 'Great Product',
        comment: 'This is a detailed review comment.'
      };

      await expect(reviewSchema.validate(invalidData)).rejects.toThrow('Rating must be at least 1');
    });

    test('should reject rating above 5', async () => {
      const invalidData = {
        rating: 6,
        title: 'Great Product',
        comment: 'This is a detailed review comment.'
      };

      await expect(reviewSchema.validate(invalidData)).rejects.toThrow('Rating must be at most 5');
    });

    test('should reject short comment', async () => {
      const invalidData = {
        rating: 5,
        title: 'Great Product',
        comment: 'Short'
      };

      await expect(reviewSchema.validate(invalidData)).rejects.toThrow('Comment must be at least 10 characters');
    });
  });
}); 