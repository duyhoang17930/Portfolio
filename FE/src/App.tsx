import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { TechStack } from './pages/TechStack';
import { Projects } from './pages/Projects';
import { Contact } from './pages/Contact';
import { Guestbook } from './pages/Guestbook';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="techstack" element={<TechStack />} />
        <Route path="projects" element={<Projects />} />
        <Route path="contact" element={<Contact />} />
        <Route path="guestbook" element={<Guestbook />} />
      </Route>
    </Routes>
  );
}

export default App;
