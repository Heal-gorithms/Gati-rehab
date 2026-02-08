## 2025-05-15 - [Reusable Input Suffix Pattern]
**Learning:** Adding a `suffix` prop to a generic `Input` component allows for highly reusable UX patterns like password visibility toggles, clear buttons, or unit indicators while maintaining design consistency.
**Action:** Use the `suffix` pattern for any interactive elements that need to be embedded within an input field, ensuring appropriate ARIA labels are provided for the suffix content.

## 2025-05-20 - [Standardized Modal Accessibility]
**Learning:** Centralizing common accessibility behaviors like 'Escape' key dismissal into a reusable hook (`useEscapeKey`) ensures consistent UX across complex apps. Accessibility wins like `aria-label` on icon-only buttons are high-impact, low-effort touches that define a premium interface.
**Action:** Always check modals for 'Escape' key support and icon-only buttons for descriptive labels. Use the `useEscapeKey` hook for all new modal components.
