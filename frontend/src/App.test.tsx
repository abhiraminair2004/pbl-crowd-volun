import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('App', () => {
  it('renders without crashing', () => {
    renderWithRouter(<App />);
  });

  it('renders the about page when navigating to /about', () => {
    window.history.pushState({}, '', '/about');
    renderWithRouter(<App />);
    expect(screen.getByText('About VeridaX')).toBeInTheDocument();
  });
});