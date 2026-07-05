import { useCallback, useEffect, useState } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { Hackathon, ParkingItem, Priority, Project, Task, Win } from '../types';
import {
  apiCreateTask,
  apiDeleteParkingItem,
  apiFetchHackathon,
  apiFetchParkingLot,
  apiFetchProjects,
  apiFetchTasks,
  apiFetchWins,
  apiPatchTask,
  apiPostParkingItem,
  apiPostWin,
  apiSaveProjects,
} from '../api';
import confetti from 'canvas-confetti';

export function useHackathonData(hackathonId: string | undefined) {
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [apiConnected, setApiConnected] = useState(false);

  const [tasks, setTasks] = useLocalStorage<Task[]>(`hackathon-${hackathonId}-tasks`, []);
  const [wins, setWins] = useLocalStorage<Win[]>(`hackathon-${hackathonId}-wins`, []);
  const [parkingLot, setParkingLot] = useLocalStorage<ParkingItem[]>(`hackathon-${hackathonId}-parking-lot`, []);
  const [projects, setProjects] = useLocalStorage<Project[]>(`hackathon-${hackathonId}-projects`, []);

  useEffect(() => {
    if (!hackathonId) return;
    setNotFound(false);
    let hackathonResult: Hackathon | null = null;
    apiFetchHackathon(hackathonId)
      .then((h) => {
        hackathonResult = h;
        return Promise.all([
          apiFetchTasks(hackathonId),
          apiFetchWins(hackathonId),
          apiFetchParkingLot(hackathonId),
          apiFetchProjects(hackathonId),
        ]);
      })
      .then(([apiTasks, apiWins, apiParkingLot, apiProjects]) => {
        setHackathon(hackathonResult);
        setTasks(apiTasks);
        setWins(apiWins);
        setParkingLot(apiParkingLot);
        setProjects(apiProjects);
        setApiConnected(true);
      })
      .catch(() => {
        setApiConnected(false);
        setNotFound(true);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hackathonId]);

  const updateTask = useCallback(
    (id: string, patch: Partial<Task>) => {
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id !== id) return t;
          if (patch.status === 'Done' && t.status !== 'Done') {
            confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
          }
          return { ...t, ...patch };
        }),
      );
      if (apiConnected && hackathonId) apiPatchTask(hackathonId, id, patch).catch(() => setApiConnected(false));
    },
    [setTasks, apiConnected, hackathonId],
  );

  const addTask = useCallback(
    (data: { title: string; primaryOwner: string; secondaryOwners: string[]; priority: Priority }) => {
      if (!hackathonId) return;
      if (apiConnected) {
        apiCreateTask(hackathonId, data)
          .then((task) => setTasks((prev) => [...prev, task]))
          .catch(() => setApiConnected(false));
      } else {
        setTasks((prev) => [
          ...prev,
          {
            id: `local-${Date.now()}`,
            title: data.title,
            primaryOwner: data.primaryOwner,
            secondaryOwners: data.secondaryOwners,
            priority: data.priority,
            status: 'Todo',
            progress: 0,
            notes: '',
            updatedAt: Date.now(),
          },
        ]);
      }
    },
    [setTasks, apiConnected, hackathonId],
  );

  const addWin = useCallback(
    (text: string) => {
      if (!hackathonId) return;
      if (apiConnected) {
        apiPostWin(hackathonId, text)
          .then((win) => setWins((prev) => [win, ...prev]))
          .catch(() => {
            setApiConnected(false);
            setWins((prev) => [{ id: `w-${Date.now()}`, text, time: Date.now() }, ...prev]);
          });
      } else {
        setWins((prev) => [{ id: `w-${Date.now()}`, text, time: Date.now() }, ...prev]);
      }
    },
    [setWins, apiConnected, hackathonId],
  );

  const addParkingItem = useCallback(
    (text: string) => {
      if (!hackathonId) return;
      if (apiConnected) {
        apiPostParkingItem(hackathonId, text)
          .then((item) => setParkingLot((prev) => [...prev, item]))
          .catch(() => {
            setApiConnected(false);
            setParkingLot((prev) => [...prev, { id: `local-${Date.now()}`, text }]);
          });
      } else {
        setParkingLot((prev) => [...prev, { id: `local-${Date.now()}`, text }]);
      }
    },
    [setParkingLot, apiConnected, hackathonId],
  );

  const removeParkingItem = useCallback(
    (id: string) => {
      setParkingLot((prev) => prev.filter((item) => item.id !== id));
      if (apiConnected && hackathonId) apiDeleteParkingItem(hackathonId, id).catch(() => setApiConnected(false));
    },
    [setParkingLot, apiConnected, hackathonId],
  );

  const saveProjects = useCallback(
    async (next: Project[]) => {
      setProjects(next);
      if (apiConnected && hackathonId) {
        try {
          const saved = await apiSaveProjects(hackathonId, next);
          setProjects(saved);
          return saved;
        } catch {
          setApiConnected(false);
          return next;
        }
      }
      return next;
    },
    [setProjects, apiConnected, hackathonId],
  );

  return {
    hackathon,
    setHackathon,
    notFound,
    apiConnected,
    tasks,
    wins,
    parkingLot,
    projects,
    updateTask,
    addTask,
    addWin,
    addParkingItem,
    removeParkingItem,
    saveProjects,
  };
}
