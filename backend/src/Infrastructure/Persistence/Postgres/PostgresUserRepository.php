<?php

namespace App\Infrastructure\Persistence\Postgres;

use App\Domain\Entity\User;
use App\Domain\Repository\UserRepositoryInterface;
use PDO;

class PostgresUserRepository implements UserRepositoryInterface
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function findById(string $id): ?User
    {
        $stmt = $this->pdo->prepare('
            SELECT * FROM users WHERE id = :id
        ');
        $stmt->execute(['id' => $id]);

        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        return $data ? $this->hydrate($data) : null;
    }

    public function findByEmail(string $email): ?User
    {
        $stmt = $this->pdo->prepare('
            SELECT * FROM users WHERE email = :email
        ');
        $stmt->execute(['email' => $email]);

        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        return $data ? $this->hydrate($data) : null;
    }

    public function findByUsername(string $username): ?User
    {
        $stmt = $this->pdo->prepare('
            SELECT * FROM users WHERE username = :username
        ');
        $stmt->execute(['username' => $username]);

        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        return $data ? $this->hydrate($data) : null;
    }

    public function save(User $user): void
    {
        if ($user->getId() === null) {
            $this->insert($user);
        } else {
            $this->update($user);
        }
    }

    public function delete(string $id): bool
    {
        $stmt = $this->pdo->prepare('DELETE FROM users WHERE id = :id');
        $stmt->execute(['id' => $id]);

        return $stmt->rowCount() > 0;
    }

    public function findAll(int $limit = 50, int $offset = 0): array
    {
        $stmt = $this->pdo->prepare('
            SELECT * FROM users 
            ORDER BY created_at DESC 
            LIMIT :limit OFFSET :offset
        ');
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();

        return array_map([$this, 'hydrate'], $stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    public function findByRole(string $role, int $limit = 50, int $offset = 0): array
    {
        $stmt = $this->pdo->prepare('
            SELECT * FROM users 
            WHERE role = :role 
            ORDER BY created_at DESC 
            LIMIT :limit OFFSET :offset
        ');
        $stmt->bindValue(':role', $role);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();

        return array_map([$this, 'hydrate'], $stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    public function searchUsers(string $search, int $limit = 50, int $offset = 0): array
    {
        $searchPattern = '%' . $search . '%';
        $stmt = $this->pdo->prepare('
            SELECT * FROM users 
            WHERE username ILIKE :search 
               OR email ILIKE :search 
               OR first_name ILIKE :search 
               OR last_name ILIKE :search
            ORDER BY created_at DESC 
            LIMIT :limit OFFSET :offset
        ');
        $stmt->bindValue(':search', $searchPattern);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();

        return array_map([$this, 'hydrate'], $stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    public function countAll(): int
    {
        $stmt = $this->pdo->query('SELECT COUNT(*) FROM users');
        return (int) $stmt->fetchColumn();
    }

    public function emailExists(string $email): bool
    {
        $stmt = $this->pdo->prepare('SELECT COUNT(*) FROM users WHERE email = :email');
        $stmt->execute(['email' => $email]);

        return (int) $stmt->fetchColumn() > 0;
    }

    public function usernameExists(string $username): bool
    {
        $stmt = $this->pdo->prepare('SELECT COUNT(*) FROM users WHERE username = :username');
        $stmt->execute(['username' => $username]);

        return (int) $stmt->fetchColumn() > 0;
    }

    private function insert(User $user): void
    {
        $id = $this->generateUuid();

        $stmt = $this->pdo->prepare('
            INSERT INTO users (
                id, username, email, password_hash, first_name, last_name, 
                phone, role, email_verified, is_active, created_at, updated_at
            ) VALUES (
                :id, :username, :email, :password_hash, :first_name, :last_name,
                :phone, :role, :email_verified, :is_active, :created_at, :updated_at
            )
        ');

        $stmt->execute([
            'id' => $id,
            'username' => $user->getUsername(),
            'email' => $user->getEmail(),
            'password_hash' => $user->getPasswordHash(),
            'first_name' => $user->getFirstName(),
            'last_name' => $user->getLastName(),
            'phone' => $user->getPhone(),
            'role' => $user->getRole(),
            'email_verified' => $user->isEmailVerified() ? 'true' : 'false',
            'is_active' => $user->isActive() ? 'true' : 'false',
            'created_at' => $user->getCreatedAt()->format('Y-m-d H:i:s'),
            'updated_at' => $user->getUpdatedAt()->format('Y-m-d H:i:s')
        ]);

        $user->setId($id);
    }

    private function update(User $user): void
    {
        $stmt = $this->pdo->prepare('
            UPDATE users SET 
                username = :username,
                email = :email,
                password_hash = :password_hash,
                first_name = :first_name,
                last_name = :last_name,
                phone = :phone,
                role = :role,
                email_verified = :email_verified,
                is_active = :is_active,
                updated_at = :updated_at,
                last_login = :last_login
            WHERE id = :id
        ');

        $stmt->execute([
            'id' => $user->getId(),
            'username' => $user->getUsername(),
            'email' => $user->getEmail(),
            'password_hash' => $user->getPasswordHash(),
            'first_name' => $user->getFirstName(),
            'last_name' => $user->getLastName(),
            'phone' => $user->getPhone(),
            'role' => $user->getRole(),
            'email_verified' => $user->isEmailVerified() ? 'true' : 'false',
            'is_active' => $user->isActive() ? 'true' : 'false',
            'updated_at' => $user->getUpdatedAt()->format('Y-m-d H:i:s'),
            'last_login' => $user->getLastLogin()?->format('Y-m-d H:i:s')
        ]);
    }

    private function hydrate(array $data): User
    {
        $user = new User(
            $data['username'],
            $data['email'],
            $data['password_hash'],
            $data['first_name'],
            $data['last_name'],
            $data['phone']
        );

        $user->setId($data['id']);
        $user->setRole($data['role']);

        if ($data['email_verified']) {
            $user->verifyEmail();
        }

        if (!$data['is_active']) {
            $user->deactivate();
        }

        return $user;
    }

    private function generateUuid(): string
    {
        $stmt = $this->pdo->query('SELECT uuid_generate_v4()');
        return $stmt->fetchColumn();
    }
}