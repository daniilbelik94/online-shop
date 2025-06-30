<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;
use App\Utils\Validator;

class ValidatorTest extends TestCase
{
    private Validator $validator;

    protected function setUp(): void
    {
        $this->validator = new Validator();
    }

    public function testRequiredField()
    {
        $this->validator->required('name', '');
        $this->assertFalse($this->validator->isValid());
        $this->assertArrayHasKey('name', $this->validator->getErrors());

        $this->validator = new Validator();
        $this->validator->required('name', 'John');
        $this->assertTrue($this->validator->isValid());
    }

    public function testEmailValidation()
    {
        $this->validator->email('email', 'invalid-email');
        $this->assertFalse($this->validator->isValid());
        $this->assertArrayHasKey('email', $this->validator->getErrors());

        $this->validator = new Validator();
        $this->validator->email('email', 'test@example.com');
        $this->assertTrue($this->validator->isValid());
    }

    public function testMinLengthValidation()
    {
        $this->validator->minLength('password', '123', 8);
        $this->assertFalse($this->validator->isValid());
        $this->assertArrayHasKey('password', $this->validator->getErrors());

        $this->validator = new Validator();
        $this->validator->minLength('password', '12345678', 8);
        $this->assertTrue($this->validator->isValid());
    }

    public function testMaxLengthValidation()
    {
        $this->validator->maxLength('name', 'Very long name that exceeds the limit', 10);
        $this->assertFalse($this->validator->isValid());
        $this->assertArrayHasKey('name', $this->validator->getErrors());

        $this->validator = new Validator();
        $this->validator->maxLength('name', 'John', 10);
        $this->assertTrue($this->validator->isValid());
    }

    public function testValidateMethod()
    {
        $data = [
            'username' => 'john_doe',
            'email' => 'john@example.com',
            'password' => 'Password123!'
        ];

        $rules = [
            'username' => ['required', 'min:3'],
            'email' => ['required', 'email'],
            'password' => ['required', 'min:8', 'password_strength']
        ];

        $result = $this->validator->validate($data, $rules);
        $this->assertTrue($result);
        $this->assertTrue($this->validator->isValid());
    }

    public function testValidateMethodWithErrors()
    {
        $data = [
            'username' => 'jo', // too short
            'email' => 'invalid-email',
            'password' => 'weak' // too weak
        ];

        $rules = [
            'username' => ['required', 'min:3'],
            'email' => ['required', 'email'],
            'password' => ['required', 'min:8', 'password_strength']
        ];

        $result = $this->validator->validate($data, $rules);
        $this->assertFalse($result);
        $this->assertFalse($this->validator->isValid());

        $errors = $this->validator->getErrors();
        $this->assertArrayHasKey('username', $errors);
        $this->assertArrayHasKey('email', $errors);
        $this->assertArrayHasKey('password', $errors);
    }

    public function testSanitizeMethod()
    {
        $data = [
            'name' => '  John Doe  ',
            'email' => 'john@example.com',
            'description' => '<script>alert("xss")</script>Hello World'
        ];

        $sanitized = $this->validator->sanitize($data);

        $this->assertEquals('John Doe', $sanitized['name']);
        $this->assertEquals('john@example.com', $sanitized['email']);
        $this->assertEquals('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;Hello World', $sanitized['description']);
    }

    public function testValidatePasswordMethod()
    {
        $this->assertTrue($this->validator->validatePassword('Password123!'));
        $this->assertTrue($this->validator->validatePassword('MyP@ssw0rd'));

        $this->assertFalse($this->validator->validatePassword('password')); // no uppercase, number, special char
        $this->assertFalse($this->validator->validatePassword('Password')); // no number, special char
        $this->assertFalse($this->validator->validatePassword('Password123')); // no special char
        $this->assertFalse($this->validator->validatePassword('Pass1!')); // too short
    }

    public function testValidateEmailMethod()
    {
        $this->assertTrue($this->validator->validateEmail('test@example.com'));
        $this->assertTrue($this->validator->validateEmail('user.name+tag@domain.co.uk'));

        $this->assertFalse($this->validator->validateEmail('invalid-email'));
        $this->assertFalse($this->validator->validateEmail('test@'));
        $this->assertFalse($this->validator->validateEmail('@example.com'));
    }

    public function testValidatePhoneMethod()
    {
        $this->assertTrue($this->validator->validatePhone('+1-555-123-4567'));
        $this->assertTrue($this->validator->validatePhone('(555) 123-4567'));
        $this->assertTrue($this->validator->validatePhone('555 123 4567'));
        $this->assertTrue($this->validator->validatePhone('5551234567'));

        $this->assertFalse($this->validator->validatePhone('abc-def-ghij'));
        $this->assertFalse($this->validator->validatePhone('555-123-4567-extra'));
    }
}