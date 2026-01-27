export const prompts = {
  parseTask: (input: string) => `
You are a task parser. Convert the following text into JSON fields:
title, description, priority (high|medium|low), due_date (ISO), category (work|personal|other), subcategory, estimated_duration (minutes), note (null).

Input: "${input}"

Return ONLY valid JSON.`,
  suggestPriority: (task: any) => `
You are a priority advisor. Given task:
Title: ${task.title}
Description: ${task.description}
Due Date: ${task.due_date}

Return JSON: {"priority":"high|medium|low","reason":"brief"}`,
  estimateDuration: (task: any) => `
You estimate duration in minutes. Task:
Title: ${task.title}
Description: ${task.description}

Return JSON: {"estimated_minutes": number, "confidence":"high|medium|low", "reason":"brief"}`,
  categorizeTask: (task: any) => `
Categorize task into: Work (Courses|Internship|Projects), Personal (Health|Social|Finance|Chores), Other.

Task:
Title: ${task.title}
Description: ${task.description}

Return JSON: {"category":"work|personal|other","subcategory":"one of allowed","confidence":0-1}`,
}
