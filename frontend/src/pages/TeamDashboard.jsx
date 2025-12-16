import React, { useEffect, useRef, useState } from 'react';
import useTeamStore from '../store/teamStore';
import useAuthStore from '../store/authStore';
import { socket } from '../api/socket';
import apiClient from '../api/apiClient';
import { FaPaperPlane, FaUserShield, FaCheck, FaTimes } from 'react-icons/fa';

export default function TeamDashboard() {
  const { myTeam, fetchMyTeam, messages, loadMessages, addMessages } = useTeamStore();
  const { user } = useAuthStore();

  const chatContainerRef = useRef(null);
  const [activeTab, setActiveTab] = useState('squad');
  const [inputMsg, setInputMsg] = useState('');

  useEffect(() => {
    const init = async () => {
      const team = await fetchMyTeam();
      if (team) {
        loadMessages(team._id);
        socket.connect();
        socket.emit('join_team', team._id);
        socket.on('receive_message', (msg) => {
          addMessages(msg);
        });
      }
    };
    init();
    return () => {
      socket.off('receive_message');
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, activeTab]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    try {
      await apiClient.post(`/api/teams/${myTeam._id}/messages`, { content: inputMsg });
      setInputMsg('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleRequest = async (userId, action) => {
    await apiClient.put(`/api/teams/${myTeam._id}/request`, { userId, action });
    fetchMyTeam();
  };

  if (!myTeam) return <div className='text-white p-10'>Loading team...</div>;

  return (
    <div className='flex flex-col h-screen bg-gray-900 text-white pb-2'>
      {/* Header */}
      <div className='bg-gray-800 p-4 shadow-md flex items-center justify-between z-10'>
        <div className='flex items-center gap-3'>
          <span className='text-3xl'>{myTeam.emblem}</span>
          <div>
            <h1 className='font-bold text-lg'>{myTeam.name}</h1>
            <p className='text-xs text-green-400'>{myTeam.members.length} Members</p>
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div className='flex border-b border-gray-700 bg-gray-800'>
        <button 
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-3 text-sm font-medium ${activeTab === 'chat' ? 'text-green-500 border-b-2 border-green-500' : 'text-gray-400'}`}
        >
          Chat
        </button>
        <button 
          onClick={() => setActiveTab('squad')}
          className={`flex-1 py-3 text-sm font-medium ${activeTab === 'squad' ? 'text-green-500 border-b-2 border-green-500' : 'text-gray-400'}`}
        >
          Squad
        </button>
        {user._id === myTeam.admin && (
          <button 
            onClick={() => setActiveTab('admin')}
            className={`flex-1 py-3 text-sm font-medium ${activeTab === 'admin' ? 'text-green-500 border-b-2 border-green-500' : 'text-gray-400'}`}
          >
            Managment
          </button>
        )}
      </div>
      {/* Content Area */}
      <div className='flex-1 overflow-y-auto bg-gray-900 relative' ref={chatContainerRef}>
        {/* Chat View */}
        {activeTab === 'chat' && (
          <div className='p-4 space-y-3 pb-20'>
            {messages.map((msg, idx) => {
                const isMe = msg.sender._id === user._id || msg.sender === user._id;
                return (
                    <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] rounded-lg p-3 ${isMe ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                            {!isMe && <p className='text-xs text-green-300 mb-1 font-bold'>{msg.sender.name}</p>}
                            <p className='text-sm'>{msg.content}</p>
                        </div>
                    </div>
                );
            })}
          </div>
        )}
        {/* Squad View */}
        {activeTab === 'squad' && (
          <div className='p-4 space-y-2'>
            {myTeam.members.map(member => (
              <div key={member._id} className='flex items-center gap-3 bg-gray-800 p-3 rounded border border-gray-700'>
                <div className='h-10 w-10 bg-gray-600 rounded-full flex items-center justify-center font-bold'>
                  {member.name.charAt(0)}
                </div>
                <div>
                  <p className='font-semibold'>{member.name}</p>
                  <p className='text-xs text-gray-400'>{member.role === 'adminTeam' ? 'Captain' : 'Player'}</p>
                </div>
                {member._id === myTeam.admin && <FaUserShield className='text-yellow-500 ml-auto' />}
              </div>
            ))}
          </div>
        )}
        {/* Managment View */}
        {activeTab === 'admin' && (
            <div className='p-4'>
                <h3 className='text-gray-400 mb-4 text-sm uppercase'>Pending requests</h3>
                {myTeam.pendingRequests.length === 0 && <p className='text-gray-500 text-center'>No requests.</p>}
                {myTeam.pendingRequests.map(req => (
                  <div key={req._id} className='bg-gray-800 p-3 rounded mb-2 flex justify-between items-center border border-gray-700'>
                      <span>{req.name}</span>
                      <div className='flex gap-2'>
                        <button onClick={() => handleRequest(req._id, 'reject')} className='p-2 bg-red-900/50 text-red-500 rounded'><FaTimes/></button>
                        <button onClick={() => handleRequest(req._id, 'approve')} className='p-2 bg-green-900/50 text-green-500 rounded'><FaCheck/></button>
                      </div>
                  </div>
                ))}
            </div>
        )}
      </div>
      {/* Input Chat (Only visible in tab chat) */}
      {activeTab === 'chat' && (
        <div className='p-3 bg-gray-800 border-t border-gray-700'>
          <form onSubmit={sendMessage} className='flex gap-2'>
            <input
              type='text'
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder='Write a message...'
              className='flex-1 bg-gray-700 text-white rounded-full px-4 focus:outline-none focus:ring-1 focus:ring-green-500'
            />
            <button type='submit' className='p-3 bg-green-600 rounded-full text-white hover:bg-green-500'>
              <FaPaperPlane />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};