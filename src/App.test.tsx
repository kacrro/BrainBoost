import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders the calculator and checks for basic UI elements', () => {
  render(<App />);
  const displayElement = screen.getByText(/0/i);
  expect(displayElement).toBeInTheDocument();
});

test('performs a simple addition', () => {
  render(<App />);

  fireEvent.click(screen.getByText('1'));
  fireEvent.click(screen.getByText('+'));
  fireEvent.click(screen.getByText('2'));
  fireEvent.click(screen.getByText('='));

  expect(screen.getByText('3')).toBeInTheDocument();
});
