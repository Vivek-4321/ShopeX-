import React from 'react';
import { describe, it , expect} from 'vitest';
import { render, screen } from '@testing-library/react';
import Test from './Test.jsx';

describe('Test component', () => {
  it('renders "Test" text', () => {
    render(<Test />);
    const textElement = screen.getByText('Test');
    expect(textElement).toBeDefined();
  });

  it('renders "Hi There" text', () => {
    render(<Test/>);
    const hiThereElement = screen.getAllByText(/Hi,there/i);
    expect(hiThereElement).toBeDefined();
  });

  it('renders name prop', () => {
    render(<Test name="vivek" />);
    const nameElement = screen.getByText(/vivek/i);
    expect(nameElement).toBeInTheDocument();
  });

  it('renders image with correct src', () => {
    render(<Test />);
    const imageElement = document.querySelector('img');
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute('src', 'https://images.unsplash.com/photo-1617854818583-09e7f077a156?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80');
  });
});

