import { isTextUIPart, type UIMessage } from "ai";

type LegacyMessage = {
  content?: string;
};

export function getTextFromUIMessage(
  message: UIMessage | LegacyMessage
): string {
  if ("parts" in message && Array.isArray(message.parts)) {
    return message.parts
      .filter(isTextUIPart)
      .map((part) => part.text)
      .join("");
  }

  if ("content" in message) {
    return message.content ?? "";
  }

  return "";
}

export function getConversationTitle(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return "New Conversation";
  return trimmed.length > 50 ? `${trimmed.slice(0, 50)}...` : trimmed;
}
