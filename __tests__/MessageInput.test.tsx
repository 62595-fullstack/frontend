import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MessageInput from "@/components/MessageInput";

// emoji-picker-react renders a heavy picker — swap it for a simple stub
vi.mock("emoji-picker-react", () => ({
  default: ({ onEmojiClick }: { onEmojiClick: (d: { emoji: string }) => void }) => (
    <button data-testid="emoji-stub" onClick={() => onEmojiClick({ emoji: "😀" })}>
      pick emoji
    </button>
  ),
}));

describe("MessageInput", () => {
  it("renders the textarea and send button", () => {
    render(<MessageInput value="" onChange={vi.fn()} onSend={vi.fn()} />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send/i })).toBeInTheDocument();
  });

  it("displays the custom placeholder", () => {
    render(
      <MessageInput value="" onChange={vi.fn()} onSend={vi.fn()} placeholder="Write here…" />
    );
    expect(screen.getByPlaceholderText("Write here…")).toBeInTheDocument();
  });

  it("calls onChange with the new value when typing", () => {
    const onChange = vi.fn();
    render(<MessageInput value="" onChange={onChange} onSend={vi.fn()} />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "hello" } });
    expect(onChange).toHaveBeenCalledWith("hello");
  });

  it("calls onSend when the send button is clicked", () => {
    const onSend = vi.fn();
    render(<MessageInput value="hello" onChange={vi.fn()} onSend={onSend} />);
    fireEvent.click(screen.getByRole("button", { name: /send/i }));
    expect(onSend).toHaveBeenCalledTimes(1);
  });

  it("does not call onSend when value is empty", () => {
    const onSend = vi.fn();
    render(<MessageInput value="" onChange={vi.fn()} onSend={onSend} />);
    fireEvent.click(screen.getByRole("button", { name: /send/i }));
    expect(onSend).not.toHaveBeenCalled();
  });

  it("does not call onSend when value is only whitespace", () => {
    const onSend = vi.fn();
    render(<MessageInput value="   " onChange={vi.fn()} onSend={onSend} />);
    fireEvent.click(screen.getByRole("button", { name: /send/i }));
    expect(onSend).not.toHaveBeenCalled();
  });

  it("calls onSend on Enter key", () => {
    const onSend = vi.fn();
    render(<MessageInput value="hello" onChange={vi.fn()} onSend={onSend} />);
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter", shiftKey: false });
    expect(onSend).toHaveBeenCalledTimes(1);
  });

  it("does not call onSend on Shift+Enter", () => {
    const onSend = vi.fn();
    render(<MessageInput value="hello" onChange={vi.fn()} onSend={onSend} />);
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter", shiftKey: true });
    expect(onSend).not.toHaveBeenCalled();
  });

  it("send button is disabled when disabled prop is set", () => {
    render(<MessageInput value="hello" onChange={vi.fn()} onSend={vi.fn()} disabled />);
    expect(screen.getByRole("button", { name: /send/i })).toBeDisabled();
  });

  it("send button is disabled when value is empty", () => {
    render(<MessageInput value="" onChange={vi.fn()} onSend={vi.fn()} />);
    expect(screen.getByRole("button", { name: /send/i })).toBeDisabled();
  });

  it("appends the chosen emoji to the value via onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<MessageInput value="hi " onChange={onChange} onSend={vi.fn()} />);

    // open picker
    await user.click(screen.getByText("😊"));
    // click the stub which fires onEmojiClick({ emoji: "😀" })
    await user.click(screen.getByTestId("emoji-stub"));

    expect(onChange).toHaveBeenCalledWith("hi 😀");
  });

  it("uses the custom sendLabel", () => {
    render(
      <MessageInput value="" onChange={vi.fn()} onSend={vi.fn()} sendLabel="Post" />
    );
    expect(screen.getByRole("button", { name: /post/i })).toBeInTheDocument();
  });
});
