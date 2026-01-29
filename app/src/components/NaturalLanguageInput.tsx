import { useState } from 'react'
import { Paper, Stack, TextField, Button, Typography, Divider, Chip, Box } from '@mui/material'
import { aiService } from '../services/aiService'
import { taskService } from '../services/taskService'

type ParsedTask = {
  title?: string
  description?: string
  priority?: string
  due_date?: string
  category?: string
  subcategory?: string
  estimated_duration?: number
  note?: string | null
}

type Props = {
  onSavePreview?: (task: ParsedTask) => void
}

const NaturalLanguageInput = ({ onSavePreview }: Props) => {
  const [input, setInput] = useState('')
  const [preview, setPreview] = useState<ParsedTask | null>(null)
  const [history, setHistory] = useState<ParsedTask[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleParse = async () => {
    if (!input.trim()) return
    setLoading(true)
    setError(null)
    try {
      const res = await aiService.parseTask(input)
      const parsed = typeof res === 'string' ? JSON.parse(res) : res.parsed || res
      setPreview(parsed)
      setHistory((h) => [...h.slice(-4), parsed])
    } catch (e: any) {
      setError(e?.message || 'Parse failed')
    } finally {
      setLoading(false)
    }
  }

  const handleUsePreview = () => {
    if (!preview) return
    const payload = {
      title: preview.title || 'Untitled task',
      description: preview.description || '',
      priority: (preview.priority as any) || 'medium',
      status: 'pending',
      category: (preview.category as any) || 'work',
      subcategory: preview.subcategory || 'Courses',
      due_date: preview.due_date || '',
      estimated_duration: typeof preview.estimated_duration === 'number' ? preview.estimated_duration : 0,
      note: preview.note ?? '',
    }

    setSaving(true)
    setError(null)
    setSuccess(null)
    taskService
      .create(payload as any)
      .then(() => {
        setSuccess('Task created from preview')
        onSavePreview?.(preview)
      })
      .catch((e) => setError(e?.message || 'Failed to create task'))
      .finally(() => setSaving(false))
  }

  return (
    <Paper sx={{ p: 3, bgcolor: '#111827', color: '#e5e7eb', borderRadius: 3, width: '100%' }} elevation={3}>
      <Stack spacing={2} alignItems='center'>
        <TextField
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='e.g., Finish the report by Friday, high priority'
          fullWidth
          InputProps={{
            sx: {
              borderRadius: '999px',
              bgcolor: '#0f172a',
              color: '#e5e7eb',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#475569' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#93c5fd' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#38bdf8' },
              px: 2,
            },
          }}
          variant='outlined'
        />
        <Stack direction='row' spacing={2}>
          <Button
            variant='contained'
            onClick={handleParse}
            disabled={loading}
            sx={{ textTransform: 'none', color: '#e5e7eb' }}
          >
            {loading ? 'Parsing...' : 'Parse'}
          </Button>
          <Button
            variant='outlined'
            onClick={() => setInput('')}
            disabled={loading}
            sx={{ textTransform: 'none', color: '#e5e7eb', borderColor: '#e5e7eb' }}
          >
            Clear
          </Button>
          <Button
            variant='outlined'
            onClick={handleUsePreview}
            disabled={!preview || loading || saving}
            sx={{ textTransform: 'none', color: '#e5e7eb', borderColor: '#e5e7eb' }}
          >
            {saving ? 'Saving...' : 'Use Preview'}
          </Button>
        </Stack>

        {error && <Typography color='error'>{error}</Typography>}
        {success && <Typography color='success.main'>{success}</Typography>}

        {preview && (
          <Box sx={{ width: '100%', bgcolor: '#0f172a', p: 2, borderRadius: 2, border: '1px solid #bdc0c4' }}>
            <Typography variant='subtitle1' sx={{ mb: 1 }}>
              Parsed Preview
            </Typography>
            <Stack spacing={0.5} sx={{ color: '#cbd5e1', fontSize: 14 }}>
              <span>Title: {preview.title}</span>
              <span>Description: {preview.description}</span>
              <span>Priority: {preview.priority}</span>
              <span>Due Date: {preview.due_date}</span>
              <span>Category: {preview.category}</span>
              <span>Subcategory: {preview.subcategory}</span>
              <span>Est. Duration: {preview.estimated_duration}</span>
            </Stack>
          </Box>
        )}

        {history.length > 0 && (
          <>
            <Divider sx={{ width: '100%', borderColor: '#1f2937' }}>Recent Parses</Divider>
            <Stack direction='row' spacing={1} flexWrap='wrap' justifyContent='center'>
              {history.slice().reverse().map((h, idx) => (
                <Chip
                  key={idx}
                  label={h.title || 'Untitled'}
                  onClick={() => setPreview(h)}
                  sx={{ bgcolor: '#1f2937', color: '#e5e7eb' }}
                />
              ))}
            </Stack>
          </>
        )}
      </Stack>
    </Paper>
  )
}

export default NaturalLanguageInput
