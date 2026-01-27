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

const Tasks = () => {
  const [form, setForm] = useState<TaskForm>(initialState)

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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    console.log('Task draft:', form)
  }

  const handleReset = () => setForm(initialState)

  return (
    <Container
      maxWidth='md'
      sx={{ mt: 4, mb: 6, display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}
    >
      <Paper
        elevation={3}
        sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, width: '100%', maxHeight: '80vh', overflowY: 'auto' }}
      >
        <Box mb={3}>
          <Typography variant='h5' fontWeight={700} gutterBottom>
            Create a Task
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Fill in the details. Submit will connect to D1 later.
          </Typography>
        </Box>

        <Box component='form' onSubmit={handleSubmit} noValidate>
          <Stack spacing={3}>
            <TextField label='Title' value={form.title} onChange={handleChange('title')} required fullWidth />
            <TextField label='Description' value={form.description} onChange={handleChange('description')} fullWidth />

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id='priority-label'>Priority</InputLabel>
                  <Select
                    labelId='priority-label'
                    value={form.priority}
                    label='Priority'
                    onChange={handleSelect('priority')}
                  >
                    <MenuItem value='high'>High</MenuItem>
                    <MenuItem value='medium'>Medium</MenuItem>
                    <MenuItem value='low'>Low</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id='status-label'>Status</InputLabel>
                  <Select
                    labelId='status-label'
                    value={form.status}
                    label='Status'
                    onChange={handleSelect('status')}
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
                  <InputLabel id='category-label'>Category</InputLabel>
                  <Select
                    labelId='category-label'
                    value={form.category}
                    label='Category'
                    onChange={handleCategoryChange}
                  >
                    <MenuItem value='work'>Work</MenuItem>
                    <MenuItem value='personal'>Personal</MenuItem>
                    <MenuItem value='other'>Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id='subcategory-label'>Subcategory</InputLabel>
                  <Select
                    labelId='subcategory-label'
                    value={form.subcategory}
                    label='Subcategory'
                    onChange={handleSelect('subcategory')}
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
                  InputLabelProps={{ shrink: true }}
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
            />

            <Stack direction='row' spacing={2} justifyContent='flex-end'>
              <Button
                variant='outlined'
                color='inherit'
                onClick={handleReset}
                sx={{ borderColor: '#9ca3af', color: '#4b5563' }}
              >
                Reset
              </Button>
              <Button variant='contained' color='primary' type='submit' sx={{ px: 4 }}>
                Save Draft
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Paper>
    </Container>
  )
}

export default Tasks