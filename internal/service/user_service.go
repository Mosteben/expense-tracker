package service

import (
	"errors"

	"github.com/mostafa/expense-tracker/internal/models"
	"github.com/mostafa/expense-tracker/internal/repository"
	"github.com/mostafa/expense-tracker/internal/utils"
	"golang.org/x/crypto/bcrypt"
)

type UserService struct {
	repo *repository.UserRepository
}

func NewUserService(repo *repository.UserRepository) *UserService {
	return &UserService{repo: repo}
}

func (s *UserService) Register(name, email, password string) error {
	existingUser, err := s.repo.GetByEmail(email)
	if err == nil && existingUser != nil {
		return errors.New("email already exists")
	}
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	user := &models.User{
		Name:     name,
		Email:    email,
		Password: string(hashedPassword),
	}
	return s.repo.Create(user)
}

func (s *UserService) Login(email, password string) (*models.User, string, error) {
	user, err := s.repo.GetByEmail(email)
	if err != nil {
		return nil, "", errors.New("invalid email or password")
	}
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		return nil, "", errors.New("invalid email or password")
	}
	token, err := utils.GenerateToken(user.ID.String())
	if err != nil {
		return nil, "", err
	}
	return user, token, nil
}

func (s *UserService) UpdateProfile(userID, name, email string) error {
	user, err := s.repo.GetByID(userID)
	if err != nil {
		return errors.New("user not found")
	}
	if email != "" && email != user.Email {
		existing, err := s.repo.GetByEmail(email)
		if err == nil && existing != nil {
			return errors.New("email already in use")
		}
	}
	if name != "" {
		user.Name = name
	}
	if email != "" {
		user.Email = email
	}
	return s.repo.Update(user)
}

func (s *UserService) ChangePassword(userID, currentPassword, newPassword string) error {
	user, err := s.repo.GetByID(userID)
	if err != nil {
		return errors.New("user not found")
	}
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(currentPassword))
	if err != nil {
		return errors.New("current password is incorrect")
	}
	if len(newPassword) < 8 {
		return errors.New("password must be at least 8 characters")
	}
	hashed, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	user.Password = string(hashed)
	return s.repo.Update(user)
}

func (s *UserService) DeleteAccount(userID string) error {
	user, err := s.repo.GetByID(userID)
	if err != nil {
		return errors.New("user not found")
	}
	return s.repo.Delete(user)
}