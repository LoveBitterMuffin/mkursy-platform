import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FullScreenLogoModal } from '../src/components/layout/FullScreenLogoModal';
import { Navbar } from '../src/components/layout/Navbar';
import { initialProfile } from '../src/data/initialData';

describe('FullScreenLogoModal Component', () => {
  it('does not render when isOpen is false', () => {
    render(<FullScreenLogoModal isOpen={false} onClose={() => {}} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders logo in frame on full screen when isOpen is true', () => {
    render(<FullScreenLogoModal isOpen={true} onClose={() => {}} />);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');

    expect(screen.getByAltText(/Символ бренда МКурсы/i)).toBeInTheDocument();
    expect(screen.getByText('МКурсы')).toBeInTheDocument();
    expect(screen.getByText(/Центр дополнительного образования/i)).toBeInTheDocument();
    expect(screen.getByText(/№ Л035-01298-77\/01609816/i)).toBeInTheDocument();
  });

  it('calls onClose when close button clicked', () => {
    const handleClose = vi.fn();
    render(<FullScreenLogoModal isOpen={true} onClose={handleClose} />);

    const closeBtn = screen.getByLabelText(/Закрыть полноэкранный просмотр/i);
    fireEvent.click(closeBtn);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape key is pressed', () => {
    const handleClose = vi.fn();
    render(<FullScreenLogoModal isOpen={true} onClose={handleClose} />);

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('renders framed logo in Navbar and navigates without opening modal', () => {
    const handleViewChange = vi.fn();
    render(
      <Navbar
        currentView="courses"
        onViewChange={handleViewChange}
        profile={initialProfile}
        isTeacherMode={false}
        onToggleTeacherMode={() => {}}
      />
    );

    const logoTrigger = screen.getByRole('button', { name: /Главная страница МКурсы/i });
    expect(screen.getByAltText(/Логотип МКурсы/i)).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    fireEvent.click(logoTrigger);
    expect(handleViewChange).toHaveBeenCalledWith('tree');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('does not contain forbidden em dash character in rendered UI', () => {
    const { container } = render(<FullScreenLogoModal isOpen={true} onClose={() => {}} />);
    const textContent = container.textContent || '';
    expect(textContent.includes('—')).toBe(false);
  });
});
