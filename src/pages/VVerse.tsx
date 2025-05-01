import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTheme } from 'next-themes';
import { Search, Phone, Video, Info, Image, FileText, Link as LinkIcon, Smile, Send } from 'lucide-react';
import { ArrowLeft } from 'lucide-react';
import api from '@/api/client';
import { getMessages, getSharedMedia, getSharedFiles, getSharedLinks, createChat, uploadFile, sendMessage } from '@/services/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { io, Socket } from 'socket.io-client';

interface Post {
  _id: string;
  author: {
    _id: string;
    name: string;
    avatar: string;
  };
  content: string;
  mediaUrls: Array<{
    url: string;
    mediaType: 'image' | 'video' | 'document';
  }>;
  community: string;
  createdAt: string;
  likes: string[];
  comments: Array<{
    user: {
      _id: string;
      name: string;
    };
    content: string;
    createdAt: string;
  }>;
}

interface Message {
  _id: string;
  content: string;
  sender: {
    _id: string;
    name: string;
    avatar: string;
  };
  mediaUrl?: string;
  mediaType?: string;
  timestamp: string;
}

interface Chat {
  _id: string;
  participants: Array<{
    _id: string;
    name: string;
    avatar: string;
    online?: boolean;
  }>;
  lastMessage?: {
    content: string;
    timestamp: string;
  };
}

interface SharedMedia {
  id: string;
  url: string;
  type: 'image' | 'video';
  timestamp: string;
}

interface SharedFile {
  id: string;
  name: string;
  size: string;
  url: string;
  timestamp: string;
}

interface SharedLink {
  id: string;
  title: string;
  url: string;
  timestamp: string;
}

const VVerse = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [selectedCommunity, setSelectedCommunity] = useState('Climate Action');
  const [selectedMedia, setSelectedMedia] = useState<File[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sharedMedia, setSharedMedia] = useState<SharedMedia[]>([]);
  const [sharedFiles, setSharedFiles] = useState<SharedFile[]>([]);
  const [sharedLinks, setSharedLinks] = useState<SharedLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const [linkInput, setLinkInput] = useState('');
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  // Fetch users and chats
  useEffect(() => {
    const fetchUsersAndChats = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch users
        const usersResponse = await api.get('/users');
        console.log('Users response:', usersResponse.data);
        setUsers(usersResponse.data);

        // Fetch chats
        const chatsResponse = await api.get('/chats');
        console.log('Chats response:', chatsResponse.data);
        setChats(chatsResponse.data);

      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load users and chats. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUsersAndChats();
    }
  }, [user]);

  // Fetch messages when chat is selected
  useEffect(() => {
    const fetchChatData = async () => {
      if (selectedChat) {
        try {
          const [messagesData, mediaData, filesData, linksData] = await Promise.all([
            getMessages(selectedChat._id),
            getSharedMedia(selectedChat._id),
            getSharedFiles(selectedChat._id),
            getSharedLinks(selectedChat._id)
          ]);
          setMessages(messagesData);
          setSharedMedia(mediaData);
          setSharedFiles(filesData);
          setSharedLinks(linksData);
        } catch (error) {
          console.error('Error fetching chat data:', error);
        }
      }
    };
    fetchChatData();
  }, [selectedChat]);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add post creation logic here
  };

  const handleSendMessage = async () => {
    if (!selectedChat || !newMessage.trim()) return;

    try {
      const response = await sendMessage(selectedChat._id, newMessage);
      setMessages(prev => [...prev, response]);
      setNewMessage('');

      // Check for links in the message
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      if (urlRegex.test(newMessage)) {
        const linksData = await getSharedLinks(selectedChat._id);
        setSharedLinks(linksData);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
    }
  };

  const handleCreateChat = async (userId: string) => {
    try {
      const selectedUser = users.find(u => u._id === userId);
      setSelectedUser(selectedUser);
      const newChat = await createChat(userId);
      setChats(prev => [...prev, newChat]);
      setSelectedChat(newChat);
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  const filteredChats = chats.filter(chat => {
    const otherParticipant = chat.participants.find(p => p._id !== user?.id);
    return otherParticipant?.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getOtherParticipant = (chat: Chat) => {
    return chat.participants.find(p => p._id !== user?.id);
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedChat) return;

    if (file.size > 25 * 1024 * 1024) { // 25MB limit
      setError('File size must be less than 25MB');
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      const response = await uploadFile(selectedChat._id, formData);
      setMessages(prev => [...prev, response]);

      // Refresh shared media/files lists
      if (response.mediaType === 'image' || response.mediaType === 'video') {
        const mediaData = await getSharedMedia(selectedChat._id);
        setSharedMedia(mediaData);
      } else {
        const filesData = await getSharedFiles(selectedChat._id);
        setSharedFiles(filesData);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleLinkSubmit = async () => {
    if (!linkInput.trim() || !selectedChat) return;

    try {
      const response = await sendMessage(selectedChat._id, linkInput);
      setMessages(prev => [...prev, response]);
      const linksData = await getSharedLinks(selectedChat._id);
      setSharedLinks(linksData);
      setLinkInput('');
      setShowLinkDialog(false);
    } catch (error) {
      console.error('Error sending link:', error);
      setError('Failed to send link');
    }
  };

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  // Handle socket events
  useEffect(() => {
    if (!socket) return;

    socket.on('new-message', (message) => {
      setMessages(prev => [...prev, message]);
      scrollToBottom();
    });

    return () => {
      socket.off('new-message');
    };
  }, [socket]);

  // Join chat room when chat is selected
  useEffect(() => {
    if (socket && selectedChat) {
      socket.emit('join-chat', selectedChat._id);
    }

    return () => {
      if (socket && selectedChat) {
        socket.emit('leave-chat', selectedChat._id);
      }
    };
  }, [socket, selectedChat]);

  return (
    <div className="flex h-screen bg-white">
          {/* Left Sidebar */}
      <div className="w-80 border-r flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-blue-600">Connected</h1>
            <button className="text-gray-500 hover:text-gray-700">
              <ArrowLeft className="h-5 w-5" />
            </button>
          </div>
          <h2 className="text-2xl font-bold mb-4">Chats</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search in chats"
              className="pl-10 bg-gray-100 border-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">Loading users...</div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-red-500">{error}</div>
            </div>
          ) : users.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">No users found</div>
            </div>
          ) : (
            users.map(user => (
              <div
                key={user._id}
                className="flex items-center p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => handleCreateChat(user._id)}
              >
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                  {user.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{user.name}</h3>
                    <span className="text-xs text-gray-500">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{user.userType}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      {selectedChat ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center">
              {selectedUser && (
                <>
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={selectedUser.avatar} />
                    <AvatarFallback>{selectedUser.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                    <h2 className="font-semibold">{selectedUser.name}</h2>
                    <p className="text-sm text-gray-500">
                      {selectedUser.online ? 'Online now' : 'Offline'}
                    </p>
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
                </Button>
              <Button variant="ghost" size="icon">
                <Phone className="h-5 w-5" />
                </Button>
              <Button variant="ghost" size="icon">
                <Video className="h-5 w-5" />
                </Button>
              <Button variant="ghost" size="icon">
                <Info className="h-5 w-5" />
                  </Button>
              </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            {messages.map(message => (
              <div
                key={message._id}
                className={`flex ${message.sender._id === user?._id ? 'justify-end' : 'justify-start'} mb-4`}
              >
                {message.sender._id !== user?._id && (
                  <Avatar className="w-8 h-8 mr-2">
                    <AvatarImage src={message.sender.avatar} />
                    <AvatarFallback>{message.sender.name[0]}</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.sender._id === user?._id
                      ? 'bg-blue-600 text-white ml-2 rounded-br-none'
                      : 'bg-gray-100 text-gray-900 mr-2 rounded-bl-none'
                  }`}
                >
                  {message.mediaUrl ? (
                    message.mediaType === 'image' ? (
                      <img
                        src={`http://localhost:5000${message.mediaUrl}`}
                        alt="Shared image"
                        className="max-w-full rounded-lg mb-2"
                        loading="lazy"
                      />
                    ) : message.mediaType === 'video' ? (
                      <video
                        src={`http://localhost:5000${message.mediaUrl}`}
                        controls
                        className="max-w-full rounded-lg mb-2"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <FileText className="h-5 w-5" />
                        <a
                          href={`http://localhost:5000${message.mediaUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                        >
                          {message.content}
                        </a>
                      </div>
                    )
                  ) : (
                    <p className="whitespace-pre-wrap break-words">
                      {message.content.match(/(https?:\/\/[^\s]+)/g) ? (
                        message.content.split(/(https?:\/\/[^\s]+)/).map((part, i) => (
                          part.match(/(https?:\/\/[^\s]+)/) ? (
                            <a
                              key={i}
                              href={part}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`underline ${message.sender._id === user?._id ? 'text-blue-200' : 'text-blue-600'}`}
                            >
                              {part}
                            </a>
                          ) : (
                            <span key={i}>{part}</span>
                          )
                        ))
                      ) : (
                        message.content
                      )}
                    </p>
                  )}
                  <span className={`text-xs mt-1 block ${message.sender._id === user?._id ? 'text-blue-200' : 'text-gray-500'} opacity-70`}>
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                {message.sender._id === user?._id && (
                  <Avatar className="w-8 h-8 ml-2">
                    <AvatarImage src={message.sender.avatar} />
                    <AvatarFallback>{message.sender.name[0]}</AvatarFallback>
                    </Avatar>
                )}
                    </div>
            ))}
            <div ref={messageEndRef} />
                  </div>

          {/* Message Input */}
          <div className="p-4 border-t">
            <div className="flex items-center space-x-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept="image/*,video/*,application/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                <Image className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                <FileText className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowLinkDialog(true)}
                disabled={isUploading}
              >
                <LinkIcon className="h-5 w-5" />
              </Button>
              <Input
                placeholder={isUploading ? 'Uploading...' : 'Type a message...'}
                className="flex-1"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isUploading}
              />
              <Button variant="ghost" size="icon">
                <Smile className="h-5 w-5" />
                    </Button>
              <Button
                size="icon"
                className="bg-blue-600 text-white hover:bg-blue-700"
                onClick={handleSendMessage}
                disabled={isUploading || !newMessage.trim()}
              >
                <Send className="h-5 w-5" />
                    </Button>
                  </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Select a chat to start messaging</p>
        </div>
      )}

      {/* Right Sidebar */}
      {selectedChat && (
        <div className="w-80 border-l p-4">
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 mb-4">
              Shared media ({sharedMedia.length})
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {sharedMedia.map((media) => (
                <img
                  key={media.id}
                  src={`http://localhost:5000${media.url}`}
                  alt="Shared media"
                  className="w-full h-20 object-cover rounded-lg cursor-pointer"
                  onClick={() => window.open(`http://localhost:5000${media.url}`, '_blank')}
                />
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 mb-4">
              Shared files ({sharedFiles.length})
            </h3>
            <div className="space-y-2">
              {sharedFiles.map((file) => (
                <div key={file.id} className="flex items-center p-2 hover:bg-gray-50 rounded-lg">
                  <FileText className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                    <a
                      href={`http://localhost:5000${file.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium hover:underline"
                    >
                      {file.name}
                    </a>
                    <p className="text-xs text-gray-500">
                      {new Date(file.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
                </div>
              </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-500 mb-4">
              Shared links ({sharedLinks.length})
            </h3>
            <div className="space-y-2">
              {sharedLinks.map((link) => (
                <div key={link.id} className="flex items-center p-2 hover:bg-gray-50 rounded-lg">
                  <LinkIcon className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium hover:underline"
                    >
                      {link.title}
                    </a>
                    <p className="text-xs text-gray-500">
                      {new Date(link.timestamp).toLocaleDateString()}
                    </p>
                </div>
                </div>
              ))}
              </div>
          </div>
        </div>
      )}

      {/* Link Dialog */}
      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Link</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <Input
              placeholder="Paste your link here"
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLinkSubmit()}
            />
      </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLinkDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleLinkSubmit} disabled={!linkInput.trim()}>
              Share
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VVerse;