import TaskTable, { TaskRow } from '../components/TaskTable'

const sampleTasks: TaskRow[] = [
  {
    id: '1',
    title: 'Finish project report',
    description: 'Complete the final draft for internship project',
    priority: 'high',
    status: 'pending',
    category: 'work',
    subcategory: 'Internship',
    dueDate: '2024-06-30',
    estimatedDuration: 120,
    note: 'Check data section',
  },
  {
    id: '2',
    title: 'Grocery run',
    description: 'Buy vegetables and staples',
    priority: 'medium',
    status: 'in_progress',
    category: 'personal',
    subcategory: 'Chores',
    dueDate: '2024-06-25',
    estimatedDuration: 45,
    note: 'Use coupons',
  },
  {
    id: '3',
    title: 'Gym session',
    description: 'Leg day routine',
    priority: 'low',
    status: 'pending',
    category: 'personal',
    subcategory: 'Health',
    dueDate: '',
    estimatedDuration: 60,
    note: '',
  },
]

const ViewTasks = () => {
  return <TaskTable tasks={sampleTasks} />
}

export default ViewTasks
