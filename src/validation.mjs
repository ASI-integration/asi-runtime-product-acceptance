export const CATEGORIES = ["Сантехника", "Электрика", "Уборка", "Мебель", "Другое"];
export const PRIORITIES = ["Низкий", "Средний", "Высокий", "Срочный"];
export const STATUSES = ["Новая", "В работе", "Выполнена"];

const required = ["property", "room", "category", "description", "priority"];

export function validateCreate(input) {
  const errors = [];
  for (const field of required) if (typeof input?.[field] !== "string" || !input[field].trim()) errors.push(`Поле «${field}» обязательно`);
  if (input?.category && !CATEGORIES.includes(input.category)) errors.push("Неизвестная категория");
  if (input?.priority && !PRIORITIES.includes(input.priority)) errors.push("Неизвестный приоритет");
  if (input?.status && !STATUSES.includes(input.status)) errors.push("Неизвестный статус");
  return errors;
}

export function validatePatch(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) return ["Тело запроса должно быть объектом"];
  const allowed = [...required, "status"];
  const keys = Object.keys(input);
  if (!keys.length) return ["Укажите хотя бы одно изменение"];
  if (keys.some((key) => !allowed.includes(key))) return ["Запрос содержит неизвестное поле"];
  const merged = { property: "x", room: "x", category: "Сантехника", description: "x", priority: "Низкий", ...input };
  return validateCreate(merged);
}
