import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import VVerse from './VVerse';
import vverseService from '../services/vverseService';

// Mock the vverseService
jest.mock('../services/vverseService', () => ({
  fetchPosts: jest.fn(),
  createPost: jest.fn(),
  likePost: jest.fn(),
  addComment: jest.fn()
}));

// Mock IntersectionObserver
let observerCallback: any = null;
const mockIntersectionObserver = jest.fn();
const mockObserve = jest.fn();
const mockUnobserve = jest.fn();
const mockDisconnect = jest.fn();

mockIntersectionObserver.mockImplementation((callback) => {
  observerCallback = callback;
  return {
    observe: mockObserve,
    unobserve: mockUnobserve,
    disconnect: mockDisconnect
  };
});

window.IntersectionObserver = mockIntersectionObserver;

describe('VVerse', () => {
  const mockPosts = [
    {
      _id: '1',
      author: {
        _id: 'user1',
        name: 'Test User',
        username: 'testuser',
        avatar: 'test-avatar.jpg'
      },
      content: 'Test post content',
      createdAt: '2024-01-01T00:00:00.000Z',
      comments: [],
      tags: ['test'],
      likes: []
    }
  ];

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    observerCallback = null;

    // Mock the service functions
    (vverseService.fetchPosts as jest.Mock).mockResolvedValue(mockPosts);
    (vverseService.createPost as jest.Mock).mockResolvedValue(mockPosts[0]);
    (vverseService.likePost as jest.Mock).mockResolvedValue(mockPosts[0]);
    (vverseService.addComment as jest.Mock).mockResolvedValue(mockPosts[0]);
  });

  it('renders the component', async () => {
    await act(async () => {
      render(<VVerse />);
    });

    // Check if the main elements are present
    expect(screen.getByPlaceholderText('Share your thoughts...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /post/i })).toBeInTheDocument();

    // Wait for posts to load
    await waitFor(() => {
      const postContent = screen.getByText('Test post content');
      expect(postContent).toBeInTheDocument();
    });
  });

  it('handles post creation', async () => {
    await act(async () => {
      render(<VVerse />);
    });

    // Mock the createPost function
    (vverseService.createPost as jest.Mock).mockResolvedValue({
      ...mockPosts[0],
      _id: '2',
      content: 'New post content'
    });

    // Fill in the post form
    const input = screen.getByPlaceholderText('Share your thoughts...');
    await act(async () => {
      fireEvent.change(input, { target: { value: 'New post content' } });
    });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /post/i });
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // Check if the new post was created
    await waitFor(() => {
      expect(vverseService.createPost).toHaveBeenCalledWith({
        content: 'New post content',
        media: null,
        mediaType: '',
        fileName: '',
        location: '',
        tags: []
      });
    });
  });

  it('handles post liking', async () => {
    await act(async () => {
      render(<VVerse />);
    });

    // Mock the likePost function
    (vverseService.likePost as jest.Mock).mockResolvedValue({
      ...mockPosts[0],
      likes: ['user1']
    });

    // Wait for posts to load
    await waitFor(() => {
      const postContent = screen.getByText('Test post content');
      expect(postContent).toBeInTheDocument();
    });

    // Click the like button
    const likeButton = screen.getByTestId('like-button-1');
    await act(async () => {
      fireEvent.click(likeButton);
    });

    // Check if the like was processed
    await waitFor(() => {
      expect(vverseService.likePost).toHaveBeenCalledWith('1');
    });
  });

  it('handles file selection', async () => {
    await act(async () => {
      render(<VVerse />);
    });

    // Create a mock file
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    // Mock the file input
    const fileInput = screen.getByTestId('file-input');
    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file] } });
    });

    // Check if the file was selected
    await waitFor(() => {
      const fileContainer = screen.getByText(/Selected file:/i).parentElement;
      expect(fileContainer).toHaveTextContent('test.jpg');
    });
  });

  it('handles error during post creation', async () => {
    await act(async () => {
      render(<VVerse />);
    });

    // Mock the createPost function to throw an error
    (vverseService.createPost as jest.Mock).mockRejectedValue(new Error('Error creating post'));

    // Fill in the post form
    const input = screen.getByPlaceholderText('Share your thoughts...');
    await act(async () => {
      fireEvent.change(input, { target: { value: 'New post content' } });
    });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /post/i });
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // Check if error message is displayed
    await waitFor(() => {
      const errorElement = screen.getByText('Error creating post');
      expect(errorElement).toBeInTheDocument();
    });
  });
});