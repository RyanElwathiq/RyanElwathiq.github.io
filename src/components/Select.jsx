// ═══════════════════════════════════════════════════════════════
//  قائمة اختيار من عننا — بديل عن <select> العادي
//
//  ليش عملناها؟ قائمة المتصفح الأصلية بيرسمها **نظام ويندوز** مش
//  الصفحة. يعني ألوانها بتتغيّر حسب إعدادات جهاز الزائر، وعلى بعض
//  الأجهزة بتطلع بخط أسود على خلفية غامقة = مش مقروءة إطلاقاً،
//  فبيحس الزائر إنه ضغط وما صار إشي.
//  هون منرسمها احنا: نفس ألوان البراند على كل جهاز، ومعها حركة.
//
//  ♿ بتشتغل بالكيبورد كمان: Enter/Space أو سهم لتحت بيفتحها،
//     الأسهم بتتنقّل، Enter بيختار، Esc بيسكّر.
//
//  ┌──────────── 🎛️ التصميم ────────────┐
//  │ كل الألوان والمقاسات: src/styles/select.css │
//  └─────────────────────────────────────┘
// ═══════════════════════════════════════════════════════════════
import { useEffect, useId, useRef, useState } from 'react';
import '../styles/select.css';

export default function Select({ id, value, onChange, options, ariaLabel }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0); // العنصر المظلَّل بالكيبورد
  const [up, setUp] = useState(false); // بتفتح لفوق إذا ما في مجال تحت
  const wrap = useRef(null);
  const listRef = useRef(null);
  const listId = useId();

  const index = Math.max(0, options.findIndex((o) => o.value === value));
  const current = options[index] || options[0];

  // ─── سكّرها لما يضغط برّا أو يضغط Esc ───
  useEffect(() => {
    if (!open) return;

    const onDown = (e) => {
      if (!wrap.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        wrap.current?.querySelector('.sel-btn')?.focus();
      }
    };
    // ⚠️ ما منسكّرها مع السكرول عن قصد: القائمة مربوطة بالزر نفسه
    //    (position: absolute) فبتتحرك معه. وكمان السكرول الناعم (Lenis)
    //    بيضل يبعت أحداث سكرول بعد ما توقف الحركة، فكان بيسكّرها بلحظتها.
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // ─── لما تفتح: ظلّل المختار حالياً وخلّيه باين ───
  useEffect(() => {
    if (!open) return;
    setActive(index);
    const el = listRef.current?.children[index];
    el?.scrollIntoView({ block: 'nearest' });
  }, [open, index]);

  const openList = () => {
    // في مجال تحت؟ إذا لأ بتفتح لفوق
    const r = wrap.current?.getBoundingClientRect();
    if (r) setUp(innerHeight - r.bottom < 260 && r.top > 260);
    setOpen(true);
  };

  const pick = (v) => {
    onChange(v);
    setOpen(false);
    wrap.current?.querySelector('.sel-btn')?.focus();
  };

  const onKeyDown = (e) => {
    const { key } = e;

    if (!open) {
      if (key === 'Enter' || key === ' ' || key === 'ArrowDown' || key === 'ArrowUp') {
        e.preventDefault();
        openList();
      }
      return;
    }

    if (key === 'ArrowDown' || key === 'ArrowUp') {
      e.preventDefault();
      const step = key === 'ArrowDown' ? 1 : -1;
      const next = (active + step + options.length) % options.length;
      setActive(next);
      listRef.current?.children[next]?.scrollIntoView({ block: 'nearest' });
    } else if (key === 'Home' || key === 'End') {
      e.preventDefault();
      setActive(key === 'Home' ? 0 : options.length - 1);
    } else if (key === 'Enter' || key === ' ') {
      e.preventDefault();
      pick(options[active].value);
    } else if (key === 'Tab') {
      setOpen(false);
    }
  };

  return (
    <div className="sel" ref={wrap} data-open={open ? '' : undefined} data-up={up ? '' : undefined}>
      <button
        type="button"
        id={id}
        className="sel-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={ariaLabel}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
      >
        <span className="sel-val">{current?.label}</span>
        <span className="sel-arrow" aria-hidden="true">
          <svg viewBox="0 0 12 8" width="12" height="8">
            <path d="M1 1.5 6 6.5 11 1.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>

      {/* ⚠️ data-lenis-prevent ضروري: السكرول الناعم (Lenis) بيمسك حركة
          الماوس باد قبل ما توصل للقائمة، فكان السحب بإصبعين جوّا القائمة
          ما بينزّلها — ولازم تسحب شريط التمرير بإيدك.
          هاي الخاصية بتقول لـ Lenis: هذا العنصر بيمرّر حاله، إتركه. */}
      {open && (
        <ul
          className="sel-list"
          id={listId}
          role="listbox"
          ref={listRef}
          tabIndex={-1}
          data-lenis-prevent
        >
          {options.map((o, i) => (
            <li
              key={o.value}
              role="option"
              aria-selected={o.value === value}
              className={`sel-opt${i === active ? ' is-active' : ''}${o.value === value ? ' is-picked' : ''}`}
              style={{ '--i': i }}
              onPointerEnter={() => setActive(i)}
              onClick={() => pick(o.value)}
            >
              {o.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
