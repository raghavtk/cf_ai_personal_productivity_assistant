import { useMemo, useState, ChangeEvent } from 'react'
import {
  Box,
  Button,
  Grid,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { taskService } from '../services/taskService'

export type TaskRow = {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  category: 'work' | 'personal' | 'other'
  subcategory: string
  dueDate: string
  estimatedDuration: number
  note: string
}

type Props = {
  tasks: TaskRow[]
  onDeleted?: (id: string) => void
}

const subcategoryMap: Record<TaskRow['category'], string[]> = {
  work: ['Courses', 'Internship', 'Projects'],
  personal: ['Health', 'Social', 'Finance', 'Chores'],
  other: ['Other'],
}

const TaskTable = ({ tasks, onDeleted }: Props) => {
  const [rows, setRows] = useState<TaskRow[]>(tasks)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState<Partial<TaskRow>>({})

  const startEdit = (id: string) => {
    const found = rows.find((r) => r.id === id)
    if (!found) return
    setEditingId(id)
    setDraft(found)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setDraft({})
  }

  const handleChange =
    (field: keyof TaskRow) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value
      setDraft((prev) => ({ ...prev, [field]: value }))
      if (field === 'category') {
        const firstSub = subcategoryMap[value as TaskRow['category']][0]
        setDraft((prev) => ({ ...prev, subcategory: firstSub }))
      }
    }

  const saveEdit = async () => {
    if (!editingId) return
    try {
      await taskService.update(editingId, {
        title: draft.title,
        description: draft.description,
        priority: draft.priority,
        status: draft.status,
        category: draft.category,
        subcategory: draft.subcategory,
        due_date: draft.dueDate,
        estimated_duration: draft.estimatedDuration,
        note: draft.note,
      } as any)
      setRows((prev) => prev.map((r) => (r.id === editingId ? { ...r, ...draft } as TaskRow : r)))
      setEditingId(null)
      setDraft({})
    } catch (error) {
      console.error('Failed to save task:', error)
      alert('Failed to save changes')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await taskService.delete(id)
      setRows((prev) => prev.filter((r) => r.id !== id))
      onDeleted?.(id)
    } catch (error) {
      console.error('Failed to delete task:', error)
      alert('Failed to delete task')
    }
  }

  const currentSubcategories = useMemo(() => {
    if (draft.category && draft.category in subcategoryMap) {
      return subcategoryMap[draft.category as TaskRow['category']]
    }
    const base = rows.find((r) => r.id === editingId)?.category || 'work'
    return subcategoryMap[base]
  }, [draft.category, editingId, rows])

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: '#1a2332',
        color: '#e5e7eb',
      }}
    >
      <Stack direction='row' alignItems='center' justifyContent='space-between' mb={2}>
        <Typography variant='h6' fontWeight={700}>
          Tasks
        </Typography>
        <Typography variant='body2' sx={{ color: '#cbd5e1' }}>
          Inline editable. Note max 200 chars.
        </Typography>
      </Stack>
      <TableContainer sx={{ maxHeight: 480 }}>
        <Table stickyHeader size='small'>
          <TableHead>
            <TableRow>
              <TableCell sx={{ bgcolor: 'rgba(255,255,255,0.06)', color: '#e5e7eb', borderBottomColor: 'rgba(255,255,255,0.12)' }}>Title</TableCell>
              <TableCell sx={{ bgcolor: 'rgba(255,255,255,0.06)', color: '#e5e7eb', borderBottomColor: 'rgba(255,255,255,0.12)' }}>Description</TableCell>
              <TableCell sx={{ bgcolor: 'rgba(255,255,255,0.06)', color: '#e5e7eb', borderBottomColor: 'rgba(255,255,255,0.12)' }}>Priority</TableCell>
              <TableCell sx={{ bgcolor: 'rgba(255,255,255,0.06)', color: '#e5e7eb', borderBottomColor: 'rgba(255,255,255,0.12)' }}>Status</TableCell>
              <TableCell sx={{ bgcolor: 'rgba(255,255,255,0.06)', color: '#e5e7eb', borderBottomColor: 'rgba(255,255,255,0.12)' }}>Category</TableCell>
              <TableCell sx={{ bgcolor: 'rgba(255,255,255,0.06)', color: '#e5e7eb', borderBottomColor: 'rgba(255,255,255,0.12)' }}>Subcategory</TableCell>
              <TableCell sx={{ bgcolor: 'rgba(255,255,255,0.06)', color: '#e5e7eb', borderBottomColor: 'rgba(255,255,255,0.12)' }}>Due Date</TableCell>
              <TableCell sx={{ bgcolor: 'rgba(255,255,255,0.06)', color: '#e5e7eb', borderBottomColor: 'rgba(255,255,255,0.12)' }}>Est. (min)</TableCell>
              <TableCell sx={{ bgcolor: 'rgba(255,255,255,0.06)', color: '#e5e7eb', borderBottomColor: 'rgba(255,255,255,0.12)' }}>Note</TableCell>
              <TableCell sx={{ bgcolor: 'rgba(255,255,255,0.06)', color: '#e5e7eb', borderBottomColor: 'rgba(255,255,255,0.12)' }} align='right'>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              const isEditing = editingId === row.id
              return (
                <TableRow key={row.id} hover>
                  <TableCell sx={{ color: '#e5e7eb' }}>
                    {isEditing ? (
                      <TextField
                        size='small'
                        value={draft.title || ''}
                        onChange={handleChange('title')}
                        fullWidth
                        InputProps={{ sx: { color: '#e5e7eb' } }}
                      />
                    ) : (
                      row.title
                    )}
                  </TableCell>
                  <TableCell sx={{ color: '#e5e7eb' }}>
                    {isEditing ? (
                      <TextField
                        size='small'
                        value={draft.description || ''}
                        onChange={handleChange('description')}
                        fullWidth
                        InputProps={{ sx: { color: '#e5e7eb' } }}
                      />
                    ) : (
                      row.description
                    )}
                  </TableCell>
                  <TableCell sx={{ color: '#e5e7eb' }}>
                    {isEditing ? (
                      <TextField
                        select
                        size='small'
                        value={draft.priority || row.priority}
                        onChange={handleChange('priority')}
                        fullWidth
                        InputProps={{ sx: { color: '#e5e7eb' } }}
                      >
                        <MenuItem value='high'>High</MenuItem>
                        <MenuItem value='medium'>Medium</MenuItem>
                        <MenuItem value='low'>Low</MenuItem>
                      </TextField>
                    ) : (
                      row.priority
                    )}
                  </TableCell>
                  <TableCell sx={{ color: '#e5e7eb' }}>
                    {isEditing ? (
                      <TextField
                        select
                        size='small'
                        value={draft.status || row.status}
                        onChange={handleChange('status')}
                        fullWidth
                        InputProps={{ sx: { color: '#e5e7eb' } }}
                      >
                        <MenuItem value='pending'>Pending</MenuItem>
                        <MenuItem value='in_progress'>In Progress</MenuItem>
                        <MenuItem value='completed'>Completed</MenuItem>
                        <MenuItem value='cancelled'>Cancelled</MenuItem>
                      </TextField>
                    ) : (
                      row.status
                    )}
                  </TableCell>
                  <TableCell sx={{ color: '#e5e7eb' }}>
                    {isEditing ? (
                      <TextField
                        select
                        size='small'
                        value={(draft.category as TaskRow['category']) || row.category}
                        onChange={handleChange('category')}
                        fullWidth
                        InputProps={{ sx: { color: '#e5e7eb' } }}
                      >
                        <MenuItem value='work'>Work</MenuItem>
                        <MenuItem value='personal'>Personal</MenuItem>
                        <MenuItem value='other'>Other</MenuItem>
                      </TextField>
                    ) : (
                      row.category
                    )}
                  </TableCell>
                  <TableCell sx={{ color: '#e5e7eb' }}>
                    {isEditing ? (
                      <TextField
                        select
                        size='small'
                        value={draft.subcategory || row.subcategory}
                        onChange={handleChange('subcategory')}
                        fullWidth
                        InputProps={{ sx: { color: '#e5e7eb' } }}
                      >
                        {currentSubcategories.map((sub) => (
                          <MenuItem key={sub} value={sub}>
                            {sub}
                          </MenuItem>
                        ))}
                      </TextField>
                    ) : (
                      row.subcategory
                    )}
                  </TableCell>
                  <TableCell sx={{ color: '#e5e7eb' }}>
                    {isEditing ? (
                      <TextField
                        type='date'
                        size='small'
                        value={draft.dueDate || row.dueDate}
                        onChange={handleChange('dueDate')}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ sx: { color: '#e5e7eb' } }}
                      />
                    ) : (
                      row.dueDate || '—'
                    )}
                  </TableCell>
                  <TableCell sx={{ color: '#e5e7eb' }}>
                    {isEditing ? (
                      <TextField
                        type='number'
                        size='small'
                        value={draft.estimatedDuration ?? row.estimatedDuration}
                        onChange={handleChange('estimatedDuration')}
                        fullWidth
                        inputProps={{ min: 0 }}
                        InputProps={{ sx: { color: '#e5e7eb' } }}
                      />
                    ) : (
                      row.estimatedDuration
                    )}
                  </TableCell>
                  <TableCell sx={{ minWidth: 180, color: '#e5e7eb' }}>
                    {isEditing ? (
                      <TextField
                        size='small'
                        value={draft.note || ''}
                        onChange={handleChange('note')}
                        fullWidth
                        inputProps={{ maxLength: 200 }}
                        InputProps={{ sx: { color: '#e5e7eb' } }}
                      />
                    ) : (
                      row.note
                    )}
                  </TableCell>
                  <TableCell align='right' sx={{ color: '#e5e7eb' }}>
                    {isEditing ? (
                      <Stack direction='row' spacing={1} justifyContent='flex-end'>
                        <Button size='small' variant='outlined' onClick={cancelEdit} sx={{ color: '#e5e7eb', borderColor: 'rgba(255,255,255,0.4)' }}>
                          Cancel
                        </Button>
                        <Button size='small' variant='contained' onClick={saveEdit}>
                          Save
                        </Button>
                      </Stack>
                    ) : (
                      <Stack direction='row' spacing={1} justifyContent='flex-end'>
                        <Button size='small' variant='text' onClick={() => startEdit(row.id)} sx={{ color: '#e5e7eb' }}>
                          Edit
                        </Button>
                        <Button size='small' variant='outlined' color='error' onClick={() => handleDelete(row.id)}>
                          Delete
                        </Button>
                      </Stack>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}

export default TaskTable
