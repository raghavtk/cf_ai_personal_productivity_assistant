import { useState, FormEvent, ChangeEvent } from 'react'
import {
  Box,
  Button,
  Container,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material'
import { taskService } from '../services/taskService'
import { useNavigate } from 'react-router-dom'

type Category = 'work' | 'personal' | 'other'
type Priority = 'high' | 'medium' | 'low'
type Status = 'pending' | 'in_progress' | 'completed'

type TaskForm = {
  title: string
  description: string
  priority: Priority
  category: Category
  subcategory: string
  dueDate: string
  estimatedDuration: string
  status: Status
  note: string
}

const initialState: TaskForm = {
  title: '',
  description: '',
  priority: 'medium',
  category: 'work',
  subcategory: 'Courses',
  dueDate: '',
  estimatedDuration: '',
  status: 'pending',
  note: '',
}

const subcategoryMap: Record<Category, string[]> = {
  work: ['Courses', 'Internship', 'Projects'],
  personal: ['Health', 'Social', 'Finance', 'Chores'],
  other: ['Other'],
}

const inputSx = {
  color: '#e5e7eb',
  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#475569' },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#93c5fd' },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#38bdf8' },
}
const labelSx = { color: '#cbd5e1', '&.Mui-focused': { color: '#e5e7eb' } }

const Tasks = () => {
  const [form, setForm] = useState<TaskForm>(initialState)
  const navigate = useNavigate()

  const handleChange =
    (field: keyof TaskForm) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSelect =
    (field: keyof TaskForm) => (e: ChangeEvent<{ value: unknown }>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value as string }))

  const handleCategoryChange = (e: ChangeEvent<{ value: unknown }>) => {
    const value = e.target.value as Category
    setForm((prev) => ({
      ...prev,
      category: value,
      subcategory: subcategoryMap[value][0],
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      await taskService.create({
        title: form.title,
        description: form.description,
        priority: form.priority,
        status: form.status,
        category: form.category,
        subcategory: form.subcategory,
        due_date: form.dueDate,
        estimated_duration: parseInt(form.estimatedDuration) || 0,
        note: form.note,
      } as any)
      alert('Task created successfully!')
      setForm(initialState)
      navigate('/')
    } catch (error) {
      console.error('Failed to create task:', error)
      alert('Failed to create task')
    }
  }

  const handleReset = () => setForm(initialState)

  return (
    <Box sx={{ bgcolor: '#0f172a', minHeight: 'calc(100vh - 80px)', py: 4 }}>
      <Container
        maxWidth='md'
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}
      >
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 3,
            width: '100%',
            maxHeight: '80vh',
            overflowY: 'auto',
            bgcolor: '#232d3f',
            color: '#e5e7eb',
          }}
        >
          <Box mb={3}>
            <Typography variant='h5' fontWeight={700} gutterBottom sx={{ color: '#e5e7eb' }}>
              Create a Task
            </Typography>
            <Typography variant='body2' sx={{ color: '#cbd5e1' }}>
              fill it out, the more info, the better!
            </Typography>
          </Box>

          <Box component='form' onSubmit={handleSubmit} noValidate>
            <Stack spacing={3}>
              <TextField label='Title' value={form.title} onChange={handleChange('title')} required fullWidth InputProps={{ sx: inputSx }} InputLabelProps={{ sx: labelSx }} />
              <TextField label='Description' value={form.description} onChange={handleChange('description')} fullWidth InputProps={{ sx: inputSx }} InputLabelProps={{ sx: labelSx }} />

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id='priority-label' sx={labelSx}>Priority</InputLabel>
                    <Select
                      labelId='priority-label'
                      value={form.priority}
                      label='Priority'
                      onChange={handleSelect('priority')}
                      sx={inputSx}
                    >
                      <MenuItem value='high'>High</MenuItem>
                      <MenuItem value='medium'>Medium</MenuItem>
                      <MenuItem value='low'>Low</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id='status-label' sx={labelSx}>Status</InputLabel>
                    <Select
                      labelId='status-label'
                      value={form.status}
                      label='Status'
                      onChange={handleSelect('status')}
                      sx={inputSx}
                    >
                      <MenuItem value='pending'>Pending</MenuItem>
                      <MenuItem value='in_progress'>In Progress</MenuItem>
                      <MenuItem value='completed'>Completed</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id='category-label' sx={labelSx}>Category</InputLabel>
                    <Select
                      labelId='category-label'
                      value={form.category}
                      label='Category'
                      onChange={handleCategoryChange}
                      sx={inputSx}
                    >
                      <MenuItem value='work'>Work</MenuItem>
                      <MenuItem value='personal'>Personal</MenuItem>
                      <MenuItem value='other'>Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id='subcategory-label' sx={labelSx}>Subcategory</InputLabel>
                    <Select
                      labelId='subcategory-label'
                      value={form.subcategory}
                      label='Subcategory'
                      onChange={handleSelect('subcategory')}
                      sx={inputSx}
                    >
                      {subcategoryMap[form.category].map((sub) => (
                        <MenuItem key={sub} value={sub}>
                          {sub}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label='Due Date'
                    type='date'
                    value={form.dueDate}
                    onChange={handleChange('dueDate')}
                    fullWidth
                    InputLabelProps={{ shrink: true, sx: labelSx }}
                    InputProps={{ sx: inputSx }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label='Estimated Duration (minutes)'
                    type='number'
                    inputProps={{ min: 0 }}
                    value={form.estimatedDuration}
                    onChange={handleChange('estimatedDuration')}
                    fullWidth
                    InputProps={{ sx: inputSx }}
                    InputLabelProps={{ sx: labelSx }}
                  />
                </Grid>
              </Grid>

              <TextField
                label='Note (max 200 chars)'
                value={form.note}
                onChange={handleChange('note')}
                fullWidth
                multiline
                minRows={2}
                inputProps={{ maxLength: 200 }}
                helperText={`${form.note.length}/200`}
                InputProps={{ sx: inputSx }}
                InputLabelProps={{ sx: labelSx }}
                FormHelperTextProps={{ sx: { color: '#cbd5e1' } }}
              />

              <Stack direction='row' spacing={2} justifyContent='flex-end'>
                <Button variant='outlined' color='inherit' onClick={handleReset} sx={{ borderColor: '#9ca3af', color: '#e5e7eb' }}>
                  Reset
                </Button>
                <Button variant='contained' color='primary' type='submit' sx={{ px: 4 }}>
                  Create Task
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default Tasks