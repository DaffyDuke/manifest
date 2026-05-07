import { signSignature, castVote, submitFeedback, getSignatureCount } from '~/lib/api/client';

const LINKEDIN_URL = /^https:\/\/([a-z]{2,3}\.)?linkedin\.com\//;

export async function refreshSignatureCount(): Promise<void> {
  try {
    const c = await getSignatureCount();
    document.querySelectorAll('[data-signature-count]').forEach((el) => {
      el.textContent = String(c);
    });
  } catch {}
}

export function wireFloatingChrome(): void {
  const header = document.querySelector<HTMLElement>('[data-floating-header]');
  const sign = document.querySelector<HTMLElement>('[data-floating-sign]');
  const sync = () => {
    const on = window.scrollY > Math.min(window.innerHeight * 0.55, 480);
    header?.classList.toggle('is-on', on);
    sign?.classList.toggle('is-on', on);
  };
  window.addEventListener('scroll', sync, { passive: true });
  sync();
}

export function wireSignFlow(): void {
  const dialog = document.getElementById('signDialog') as HTMLDialogElement | null;
  const form = document.getElementById('signDialogForm') as HTMLFormElement | null;
  const nameEl = document.getElementById('dialogSignName') as HTMLInputElement | null;
  const linkedinEl = document.getElementById('dialogSignLinkedin') as HTMLInputElement | null;

  document.querySelectorAll<HTMLElement>('#signOpen, [data-floating-sign]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      dialog?.showModal?.();
    });
  });
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = nameEl?.value.trim() || '';
    const linkedin = linkedinEl?.value.trim() || '';
    if (!name || !linkedin || !LINKEDIN_URL.test(linkedin)) {
      linkedinEl?.focus();
      return;
    }
    const r = await signSignature({ name, linkedin });
    if (r.ok) {
      const grid = document.getElementById('wallGrid');
      if (grid) {
        const el = document.createElement('div');
        el.className = 'sig new';
        el.innerHTML = `<a href="${linkedin}" target="_blank" rel="noopener">${name}</a><span class="meta">2026</span>`;
        grid.appendChild(el);
      }
      await refreshSignatureCount();
      dialog?.close();
      form.reset();
    }
  });
  dialog?.querySelector<HTMLButtonElement>('[data-close]')?.addEventListener('click', () => dialog.close());
}

export function wireVoteWidgets(): void {
  const dvDialog = document.getElementById('downvoteDialog') as HTMLDialogElement | null;
  const dvForm = document.getElementById('downvoteForm') as HTMLFormElement | null;
  const dvType = document.getElementById('dvTargetType') as HTMLInputElement | null;
  const dvId = document.getElementById('dvTargetId') as HTMLInputElement | null;
  const dvReason = document.getElementById('dvReason') as HTMLTextAreaElement | null;
  const dvAlt = document.getElementById('dvAlternative') as HTMLTextAreaElement | null;

  document.querySelectorAll<HTMLElement>('.vote-widget').forEach((widget) => {
    const targetType = widget.dataset.voteTargetType as 'principle' | 'value';
    const targetId = widget.dataset.voteTargetId as string;
    const scoreEl = widget.querySelector<HTMLElement>('[data-vote-score]');
    const up = widget.querySelector<HTMLElement>('[data-vote-action="up"]');
    const down = widget.querySelector<HTMLElement>('[data-vote-action="down"]');
    const paint = (s: number) => {
      if (!scoreEl) return;
      scoreEl.textContent = String(s);
      scoreEl.dataset.voteScore = String(s);
    };
    up?.addEventListener('click', async () => {
      const r = await castVote({ targetType, targetId, value: 1 });
      if (!r.ok || r.score === undefined) return;
      paint(r.score);
      up.classList.add('is-cast');
      down?.classList.remove('is-cast');
    });
    down?.addEventListener('click', async () => {
      const r = await castVote({ targetType, targetId, value: -1 });
      if (r.ok && r.score !== undefined) {
        paint(r.score);
        down.classList.add('is-cast');
        up?.classList.remove('is-cast');
      }
      if (dvDialog?.showModal && dvType && dvId) {
        dvType.value = targetType;
        dvId.value = targetId;
        dvDialog.showModal();
      }
    });
  });

  dvForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!dvType || !dvId || !dvReason || !dvAlt) return;
    await submitFeedback({
      targetType: dvType.value as 'principle' | 'value',
      targetId: dvId.value,
      reason: dvReason.value,
      alternative: dvAlt.value,
    });
    dvDialog?.close();
    dvForm.reset();
  });
  dvDialog?.querySelector<HTMLButtonElement>('[data-close]')?.addEventListener('click', () => dvDialog.close());
}
