import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AboutUs from './AboutUs';

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('AboutUs', () => {
  beforeEach(() => {
    renderWithRouter(<AboutUs />);
  });

  it('renders the hero section', () => {
    expect(screen.getByText('About VeridaX')).toBeInTheDocument();
    expect(screen.getByText(/Connecting passionate individuals/)).toBeInTheDocument();
  });

  it('renders mission and vision sections', () => {
    expect(screen.getByText('Our Mission')).toBeInTheDocument();
    expect(screen.getByText('Our Vision')).toBeInTheDocument();
  });

  it('renders the story section', () => {
    expect(screen.getByText('Our Story')).toBeInTheDocument();
    expect(screen.getByText(/The idea was first formulated by Abhirami/)).toBeInTheDocument();
  });

  it('renders team members', () => {
    expect(screen.getByText('Our Founders')).toBeInTheDocument();
    expect(screen.getByText('Abhirami Nair')).toBeInTheDocument();
    expect(screen.getByText('Aditi Bansal')).toBeInTheDocument();
    expect(screen.getByText('Aparna Nair')).toBeInTheDocument();
  });

  it('renders LinkedIn links', () => {
    const links = screen.getAllByText('LinkedIn Profile');
    expect(links).toHaveLength(3);
    links.forEach(link => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  it('renders team member images', () => {
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(3);
    expect(images[0]).toHaveAttribute('alt', 'Abhirami Nair');
    expect(images[1]).toHaveAttribute('alt', 'Aditi Bansal');
    expect(images[2]).toHaveAttribute('alt', 'Aparna Nair');
  });
});