// Mock API servisi - gerçek API çalışmadığında kullanılacak sahte veri kaynağı

// Başlangıç verileri
const MOCK_DATA = {
  users: [
    {
      _id: '1',
      name: 'Test Kullanıcı',
      nickname: 'test',
      email: 'test@example.com',
      role: 'user'
    },
    {
      _id: '2',
      name: 'Admin Kullanıcı',
      nickname: 'admin',
      email: 'admin@example.com',
      role: 'admin'
    }
  ],
  twits: [
    {
      _id: '101',
      content: 'Bu bir test twitidir!',
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      userId: '1',
      user: {
        _id: '1',
        name: 'Test Kullanıcı',
        nickname: 'test'
      },
      likes: 5,
      replies: 2,
      likedByMe: false
    },
    {
      _id: '102',
      content: 'Merhaba dünya! #Kiwitter',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      userId: '2',
      user: {
        _id: '2',
        name: 'Admin Kullanıcı',
        nickname: 'admin'
      },
      likes: 10,
      replies: 3,
      likedByMe: false
    },
    {
      _id: '103',
      content: 'Bu proje React ile hazırlanmıştır.',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      userId: '1',
      user: {
        _id: '1',
        name: 'Test Kullanıcı',
        nickname: 'test'
      },
      likes: 7,
      replies: 1,
      likedByMe: true
    }
  ],
  replies: [
    {
      _id: '201',
      content: 'Harika bir twit!',
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      userId: '2',
      twitId: '101',
      user: {
        _id: '2',
        name: 'Admin Kullanıcı',
        nickname: 'admin'
      },
      likes: 2,
      likedByMe: false
    },
    {
      _id: '202',
      content: 'Teşekkürler!',
      createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
      userId: '1',
      twitId: '102',
      user: {
        _id: '1',
        name: 'Test Kullanıcı',
        nickname: 'test'
      },
      likes: 1,
      likedByMe: false
    }
  ]
};

// ID üreteci
const generateId = () => {
  return Math.floor(Math.random() * 10000).toString();
};

// Promise sonucu geciktirme (gerçek API hissiyatı için)
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Mock Auth servisi
export const authService = {
  register: async (userData) => {
    await delay();
    // Yeni kullanıcı oluştur
    const newUser = {
      _id: generateId(),
      ...userData,
      role: 'user'
    };
    
    return {
      data: {
        message: 'Kullanıcı başarıyla oluşturuldu',
        user: newUser
      }
    };
  },

  login: async (credentials) => {
    await delay();
    // Kullanıcı kontrolü
    const user = MOCK_DATA.users.find(u => u.nickname === credentials.nickname);
    
    if (!user) {
      throw {
        response: {
          status: 401,
          data: { message: 'Kullanıcı bulunamadı' }
        }
      };
    }
    
    return {
      data: {
        token: 'mock-jwt-token',
        user
      }
    };
  }
};

// Mock Twit servisi
export const twitService = {
  createTwit: async (content) => {
    await delay();
    const currentUser = JSON.parse(localStorage.getItem('user'));
    
    const newTwit = {
      _id: generateId(),
      content,
      createdAt: new Date().toISOString(),
      userId: currentUser._id,
      user: {
        _id: currentUser._id,
        name: currentUser.name,
        nickname: currentUser.nickname
      },
      likes: 0,
      replies: 0,
      likedByMe: false
    };
    
    // Yeni twiti listeye ekle
    MOCK_DATA.twits.unshift(newTwit);
    
    return {
      data: {
        message: 'Twit başarıyla oluşturuldu',
        twit: newTwit
      }
    };
  },

  getAllTwits: async () => {
    await delay();
    return {
      data: MOCK_DATA.twits.filter(t => !t.twitId) // Ana twitler (yanıt olmayanlar)
    };
  },

  getPopularTwits: async () => {
    await delay();
    // Beğeni sayısına göre sırala
    const sortedTwits = [...MOCK_DATA.twits]
      .filter(t => !t.twitId) // Ana twitler (yanıt olmayanlar)
      .sort((a, b) => b.likes - a.likes);
    
    return {
      data: sortedTwits
    };
  },

  getTwitDetails: async (twitId) => {
    await delay();
    const twit = MOCK_DATA.twits.find(t => t._id === twitId);
    
    if (!twit) {
      throw {
        response: {
          status: 404,
          data: { message: 'Twit bulunamadı' }
        }
      };
    }
    
    // Yanıtları bul
    const replies = MOCK_DATA.replies.filter(r => r.twitId === twitId);
    
    return {
      data: {
        twit,
        replies
      }
    };
  },

  replyToTwit: async (twitId, content) => {
    await delay();
    const currentUser = JSON.parse(localStorage.getItem('user'));
    
    const targetTwit = MOCK_DATA.twits.find(t => t._id === twitId);
    if (!targetTwit) {
      throw {
        response: {
          status: 404,
          data: { message: 'Yanıtlamak istediğiniz twit bulunamadı' }
        }
      };
    }
    
    const newReply = {
      _id: generateId(),
      content,
      createdAt: new Date().toISOString(),
      userId: currentUser._id,
      twitId,
      user: {
        _id: currentUser._id,
        name: currentUser.name,
        nickname: currentUser.nickname
      },
      likes: 0,
      likedByMe: false
    };
    
    // Yanıtı listeye ekle
    MOCK_DATA.replies.unshift(newReply);
    
    // Twit'in yanıt sayısını güncelle
    targetTwit.replies++;
    
    return {
      data: {
        message: 'Yanıt başarıyla gönderildi',
        reply: newReply
      }
    };
  },

  likeTwit: async (twitId) => {
    await delay();
    
    // Twit'i bul (ana twit veya yanıt olabilir)
    const twit = MOCK_DATA.twits.find(t => t._id === twitId) || 
                MOCK_DATA.replies.find(r => r._id === twitId);
    
    if (!twit) {
      throw {
        response: {
          status: 404,
          data: { message: 'Beğenmek istediğiniz twit bulunamadı' }
        }
      };
    }
    
    // Beğeni sayısını artır ve beğenildi olarak işaretle
    twit.likes++;
    twit.likedByMe = true;
    
    return {
      data: {
        message: 'Twit başarıyla beğenildi'
      }
    };
  },

  deleteTwit: async (twitId) => {
    await delay();
    
    // Twit'i bulup sil
    const twitIndex = MOCK_DATA.twits.findIndex(t => t._id === twitId);
    
    if (twitIndex === -1) {
      throw {
        response: {
          status: 404,
          data: { message: 'Silmek istediğiniz twit bulunamadı' }
        }
      };
    }
    
    // Twit'i sil
    MOCK_DATA.twits.splice(twitIndex, 1);
    
    // Twit'e ait yanıtları da sil
    MOCK_DATA.replies = MOCK_DATA.replies.filter(r => r.twitId !== twitId);
    
    return {
      data: {
        message: 'Twit başarıyla silindi'
      }
    };
  }
};

// Mock User servisi
export const userService = {
  getUserTwits: async (nickname) => {
    await delay();
    
    // Kullanıcıyı bul
    const user = MOCK_DATA.users.find(u => u.nickname === nickname);
    
    if (!user) {
      throw {
        response: {
          status: 404,
          data: { message: 'Kullanıcı bulunamadı' }
        }
      };
    }
    
    // Kullanıcının twitlerini bul
    const twits = MOCK_DATA.twits.filter(t => t.userId === user._id);
    
    return {
      data: {
        user,
        twits
      }
    };
  },

  getUserLikes: async (userId) => {
    await delay();
    
    // Kullanıcının beğendiği twitleri bul (likedByMe true olanlar)
    const likedTwits = MOCK_DATA.twits.filter(t => t.likedByMe);
    
    return {
      data: {
        twits: likedTwits
      }
    };
  }
}; 