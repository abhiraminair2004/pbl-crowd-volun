import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from './footer';

describe('Footer', () => {
  it('renders copyright text with current year', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(`© ${currentYear} VeridaX. All rights reserved.`)).toBeInTheDocument();
  });

  it('has the correct styling classes', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('footer');
    expect(footer).toHaveClass('bg-white', 'py-8');
  });
});