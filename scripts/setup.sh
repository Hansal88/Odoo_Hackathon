#!/usr/bin/env bash

# 🚀 Traveloop Development Setup Script
# Initializes all dependencies and configuration for development

set -e  # Exit on error

echo "🚀 Starting Traveloop Setup..."
echo "================================"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
echo -e "${BLUE}Checking Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node --version)${NC}"

# Check npm
echo -e "${BLUE}Checking npm...${NC}"
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi
echo -e "${GREEN}✓ npm $(npm --version)${NC}"

# Check Git
echo -e "${BLUE}Checking Git...${NC}"
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed"
    exit 1
fi
echo -e "${GREEN}✓ Git $(git --version | awk '{print $3}')${NC}"

# Install backend dependencies
echo -e "\n${BLUE}Installing Backend Dependencies...${NC}"
cd backend
npm install
echo -e "${GREEN}✓ Backend dependencies installed${NC}"

# Setup backend .env
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating backend .env file...${NC}"
    cp .env.example .env
    echo -e "${YELLOW}⚠️ Edit backend/.env with your configuration${NC}"
else
    echo -e "${GREEN}✓ backend/.env exists${NC}"
fi

cd ..

# Install frontend dependencies
echo -e "\n${BLUE}Installing Frontend Dependencies...${NC}"
cd frontend
npm install
echo -e "${GREEN}✓ Frontend dependencies installed${NC}"

# Setup frontend .env
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}Creating frontend .env.local file...${NC}"
    cp .env.example .env.local
    echo -e "${YELLOW}⚠️ Edit frontend/.env.local with your configuration${NC}"
else
    echo -e "${GREEN}✓ frontend/.env.local exists${NC}"
fi

cd ..

# Setup Git hooks (optional)
echo -e "\n${BLUE}Setting up Git hooks...${NC}"
if command -v husky &> /dev/null; then
    husky install
    echo -e "${GREEN}✓ Git hooks installed${NC}"
else
    echo -e "${YELLOW}⚠️ Husky not installed (optional)${NC}"
fi

# Summary
echo -e "\n${GREEN}================================${NC}"
echo -e "${GREEN}✓ Setup Complete!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo "1. Configure environment variables:"
echo "   - Edit backend/.env"
echo "   - Edit frontend/.env.local"
echo ""
echo "2. Start MongoDB:"
echo "   - Local: mongod"
echo "   - Or use MongoDB Atlas connection string"
echo ""
echo "3. Start development:"
echo "   - npm run dev (from root)"
echo ""
echo -e "${BLUE}Useful Commands:${NC}"
echo "  npm run dev        - Start frontend & backend"
echo "  npm run backend    - Start backend only"
echo "  npm run frontend   - Start frontend only"
echo ""
