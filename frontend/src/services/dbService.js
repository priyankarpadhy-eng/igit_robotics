import { db } from './firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  setDoc,
  limit
} from 'firebase/firestore';

// System Default Data for seeding/fallback
export const defaultEvents = [
  {
    title: 'Intro to Arduino',
    desc: 'Hands-on hardware basics with your first circuits.',
    dateMonth: 'SEP',
    dateDay: '15',
    location: 'IGIT Campus',
    price: 'Starts from ₹100',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600',
    color: '#0f172a',
    status: 'FINISHED'
  },
  {
    title: 'ROS Masterclass',
    desc: 'Advanced robotics OS training session.',
    dateMonth: 'OCT',
    dateDay: '04',
    location: 'Virtual',
    price: 'Free Entry',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600',
    color: '#0f172a',
    status: 'LIVE'
  },
  {
    title: 'PCB Fabrication',
    desc: 'Learn to design and print your own boards.',
    dateMonth: 'NOV',
    dateDay: '12',
    location: 'Robotics Lab',
    price: 'Starts from ₹250',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=600',
    color: '#0f172a',
    status: 'UPCOMING'
  },
  {
    title: 'AI Vision Workshop',
    desc: 'Computer vision and object detection.',
    dateMonth: 'DEC',
    dateDay: '24',
    location: 'IGIT Auditorium',
    price: 'Starts from ₹150',
    image: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?q=80&w=600',
    color: '#0f172a',
    status: 'UPCOMING'
  }
];

export const defaultGallery = [
  { url: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?q=80&w=600', title: 'Robo Wars', context: 'Our combat robot in action at TechFest.' },
  { url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=600', title: 'AI Automation', context: 'Testing the vision system for our autonomous rover.' },
  { url: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=600', title: 'Team Meeting', context: 'Strategizing for the upcoming hackathon.' },
  { url: 'https://images.unsplash.com/photo-1563207153-f40879981881?q=80&w=600', title: 'Hardware Dev', context: 'Soldering custom PCBs in the lab.' },
  { url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600', title: '3D Printing', context: 'Prototyping chassis parts overnight.' },
  { url: 'https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?q=80&w=600', title: 'Drone Testing', context: 'First flight test of the Quadcopter.' },
  { url: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?q=80&w=600', title: 'Coding Session', context: 'Debugging the ROS nodes.' },
  { url: 'https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?q=80&w=600', title: 'Workshop', context: 'Teaching juniors about microcontrollers.' },
  { url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=600', title: 'Circuit Design', context: 'Finalizing the schematics.' },
  { url: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?q=80&w=600', title: 'Machine Learning', context: 'Training models for object detection.' },
  { url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600', title: 'Exhibition', context: 'Showcasing our projects to the university.' },
  { url: 'https://images.unsplash.com/photo-1495055154266-57bbdeada43e?q=80&w=600', title: 'Sensor Integration', context: 'Calibrating the LIDAR.' },
  { url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600', title: 'Data Analysis', context: 'Reviewing logs from the autonomous run.' },
  { url: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?q=80&w=600', title: 'Assembly Line', context: 'Putting together the robotic arm.' },
  { url: 'https://images.unsplash.com/photo-1610309995543-c0d6cfdfa380?q=80&w=600', title: 'VR Setup', context: 'Teleoperating the rover in VR.' },
  { url: 'https://images.unsplash.com/photo-1576401662998-ce8ccf149b18?q=80&w=600', title: 'Success!', context: 'Winning the regional championship.' }
];

export const defaultMembers = [
  { name: 'Dr. A. K. Sharma', role: 'Faculty Advisor', color: '#ffcd6d', batch: 'Dept. of CS', category: 'faculty' },
  { name: 'Dr. B. P. Singh', role: 'Co-Advisor', color: '#95d5b2', batch: 'Dept. of EE', category: 'faculty' },
  { name: 'Navdeep Ghosh', role: 'Robotics Advisor', color: '#ffcd6d', batch: '41st Batch', category: 'leadership' },
  { name: 'Debasish Mallick', role: 'Robotics Advisor', color: '#95d5b2', batch: '41st Batch', category: 'leadership' },
  { name: 'Reetika Mohanty', role: 'Robotics Advisor', color: '#0f172a', batch: '41st Batch', category: 'leadership' },
  { name: 'Pritish Nayak', role: 'Robotics Secretary', color: '#fdf9e1', batch: '42nd Batch', img: '/pritish-kumar-nayak.png', category: 'leadership' },
  { name: 'Prayash Agarwal', role: 'Robotics Secretary', color: '#d8e9f0', batch: '42nd Batch', category: 'leadership' },
  { name: 'Pritiparana Nayak', role: 'Robotics Secretary', color: '#ffcd6d', batch: '42nd Batch', img: '/pritiparna-nayak.png', category: 'leadership' },
  { name: 'Satya Sworup Pradhan', role: 'Robotics Representative', color: '#95d5b2', batch: '43rd Batch', img: '/satys-sworup.png', category: 'leadership' },
  { name: 'Sushree Mohanty', role: 'Robotics Representative', color: '#0f172a', batch: '43rd Batch', category: 'leadership' },
  { name: 'Rahul Verma', role: 'Software Engineer @ Google', color: '#fdf9e1', batch: 'Class of 2020', category: 'alumni' },
  { name: 'Anjali Das', role: 'Robotics Engineer @ Tesla', color: '#d8e9f0', batch: 'Class of 2020', category: 'alumni' },
  { name: 'Vikas Kumar', role: 'Researcher @ ISRO', color: '#ffcd6d', batch: 'Class of 2021', category: 'alumni' }
];

// Helper to check table connectivity
export async function getDbHealth() {
  const health = { firebaseConnected: false, collectionsFound: { events: false, gallery: false, members: false } };
  try {
    const eSnap = await getDocs(query(collection(db, 'events'), limit(1)));
    health.collectionsFound.events = true;

    const gSnap = await getDocs(query(collection(db, 'gallery'), limit(1)));
    health.collectionsFound.gallery = true;

    const mSnap = await getDocs(query(collection(db, 'members'), limit(1)));
    health.collectionsFound.members = true;

    health.firebaseConnected = true;
  } catch (e) {
    console.warn('Firestore health check failed, falling back to LocalStorage', e);
  }
  return health;
}

// Local Storage Fallback Helpers
const getLocal = (key, defaultVal) => {
  const val = localStorage.getItem(key);
  if (!val) {
    localStorage.setItem(key, JSON.stringify(defaultVal));
    return defaultVal;
  }
  return JSON.parse(val);
};

const setLocal = (key, val) => {
  localStorage.setItem(key, JSON.stringify(val));
};

// --- EVENTS SERVICE ---
export const eventsService = {
  getAll: async () => {
    try {
      const q = query(collection(db, 'events'), orderBy('created_at', 'desc'));
      const snap = await getDocs(q);
      if (snap.empty) {
        return getLocal('robotics_events', defaultEvents);
      }
      return snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (e) {
      console.warn('Falling back to LocalStorage for Events:', e.message);
      return getLocal('robotics_events', defaultEvents);
    }
  },
  create: async (event) => {
    try {
      const payload = {
        title: event.title,
        desc: event.desc,
        dateMonth: event.dateMonth,
        dateDay: event.dateDay,
        location: event.location,
        price: event.price,
        image: event.image,
        color: event.color || '#0f172a',
        status: event.status || 'UPCOMING',
        created_at: new Date().toISOString()
      };
      const docRef = await addDoc(collection(db, 'events'), payload);
      return { id: docRef.id, ...payload };
    } catch (e) {
      console.warn('Falling back to LocalStorage for Event creation');
      const list = getLocal('robotics_events', defaultEvents);
      const newEvent = { ...event, id: crypto.randomUUID() };
      list.unshift(newEvent);
      setLocal('robotics_events', list);
      return newEvent;
    }
  },
  update: async (id, event) => {
    try {
      const ref = doc(db, 'events', id);
      const payload = {
        title: event.title,
        desc: event.desc,
        dateMonth: event.dateMonth,
        dateDay: event.dateDay,
        location: event.location,
        price: event.price,
        image: event.image,
        color: event.color,
        status: event.status
      };
      await updateDoc(ref, payload);
      return { id, ...payload };
    } catch (e) {
      console.warn('Falling back to LocalStorage for Event update');
      const list = getLocal('robotics_events', defaultEvents);
      const idx = list.findIndex(item => item.id === id || (item.title === event.title && item.desc === event.desc));
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...event };
        setLocal('robotics_events', list);
      }
      return event;
    }
  },
  delete: async (id, title) => {
    try {
      await deleteDoc(doc(db, 'events', id));
    } catch (e) {
      console.warn('Falling back to LocalStorage for Event deletion');
      const list = getLocal('robotics_events', defaultEvents);
      const filtered = list.filter(item => item.id !== id && item.title !== title);
      setLocal('robotics_events', filtered);
    }
  }
};

// --- GALLERY SERVICE ---
export const galleryService = {
  getAll: async () => {
    try {
      const q = query(collection(db, 'gallery'), orderBy('uploaded_at', 'desc'));
      const snap = await getDocs(q);
      if (snap.empty) {
        return getLocal('robotics_gallery', defaultGallery);
      }
      return snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (e) {
      console.warn('Falling back to LocalStorage for Gallery:', e.message);
      return getLocal('robotics_gallery', defaultGallery);
    }
  },
  create: async (item) => {
    try {
      const payload = {
        url: item.url,
        title: item.title,
        context: item.context,
        uploaded_at: new Date().toISOString()
      };
      const docRef = await addDoc(collection(db, 'gallery'), payload);
      return { id: docRef.id, ...payload };
    } catch (e) {
      console.warn('Falling back to LocalStorage for Gallery creation');
      const list = getLocal('robotics_gallery', defaultGallery);
      const newItem = { ...item, id: crypto.randomUUID() };
      list.unshift(newItem);
      setLocal('robotics_gallery', list);
      return newItem;
    }
  },
  delete: async (id, url) => {
    try {
      await deleteDoc(doc(db, 'gallery', id));
    } catch (e) {
      console.warn('Falling back to LocalStorage for Gallery deletion');
      const list = getLocal('robotics_gallery', defaultGallery);
      const filtered = list.filter(item => item.id !== id && item.url !== url);
      setLocal('robotics_gallery', filtered);
    }
  }
};

// --- MEMBERS SERVICE ---
export const membersService = {
  getAll: async () => {
    try {
      const snap = await getDocs(collection(db, 'members'));
      if (snap.empty) {
        return getLocal('robotics_members', defaultMembers);
      }
      return snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (e) {
      console.warn('Falling back to LocalStorage for Members:', e.message);
      return getLocal('robotics_members', defaultMembers);
    }
  },
  create: async (member) => {
    try {
      const payload = {
        name: member.name,
        role: member.role,
        color: member.color || '#ffcd6d',
        batch: member.batch,
        img: member.img || '',
        category: member.category || 'leadership',
        joined_at: new Date().toISOString()
      };
      const docRef = await addDoc(collection(db, 'members'), payload);
      return { id: docRef.id, ...payload };
    } catch (e) {
      console.warn('Falling back to LocalStorage for Member creation');
      const list = getLocal('robotics_members', defaultMembers);
      const newMember = { ...member, id: crypto.randomUUID() };
      list.push(newMember);
      setLocal('robotics_members', list);
      return newMember;
    }
  },
  update: async (id, member) => {
    try {
      const ref = doc(db, 'members', id);
      const payload = {
        name: member.name,
        role: member.role,
        color: member.color,
        batch: member.batch,
        img: member.img,
        category: member.category
      };
      await updateDoc(ref, payload);
      return { id, ...payload };
    } catch (e) {
      console.warn('Falling back to LocalStorage for Member update');
      const list = getLocal('robotics_members', defaultMembers);
      const idx = list.findIndex(item => item.id === id || (item.name === member.name && item.role === member.role));
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...member };
        setLocal('robotics_members', list);
      }
      return member;
    }
  },
  delete: async (id, name) => {
    try {
      await deleteDoc(doc(db, 'members', id));
    } catch (e) {
      console.warn('Falling back to LocalStorage for Member deletion');
      const list = getLocal('robotics_members', defaultMembers);
      const filtered = list.filter(item => item.id !== id && item.name !== name);
      setLocal('robotics_members', filtered);
    }
  }
};

// Seeding utility for Admin Panel
export const seedDatabase = {
  resetLocal: () => {
    localStorage.setItem('robotics_events', JSON.stringify(defaultEvents));
    localStorage.setItem('robotics_gallery', JSON.stringify(defaultGallery));
    localStorage.setItem('robotics_members', JSON.stringify(defaultMembers));
  },
  syncToFirestore: async () => {
    // Seed events
    for (const item of defaultEvents) {
      await addDoc(collection(db, 'events'), {
        title: item.title,
        desc: item.desc,
        dateMonth: item.dateMonth,
        dateDay: item.dateDay,
        location: item.location,
        price: item.price,
        image: item.image,
        color: item.color,
        status: item.status,
        created_at: new Date().toISOString()
      });
    }
    // Seed gallery
    for (const item of defaultGallery) {
      await addDoc(collection(db, 'gallery'), {
        url: item.url,
        title: item.title,
        context: item.context,
        uploaded_at: new Date().toISOString()
      });
    }
    // Seed members
    for (const item of defaultMembers) {
      await addDoc(collection(db, 'members'), {
        name: item.name,
        role: item.role,
        color: item.color,
        batch: item.batch,
        img: item.img || '',
        category: item.category,
        joined_at: new Date().toISOString()
      });
    }
  }
};
