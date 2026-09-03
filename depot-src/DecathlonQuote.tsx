import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import { t, translations } from '@/i18n/translations';
import type { Locale } from '@/i18n/translations';

const quote = {
  en: '"At Decathlon, our challenge is capturing very precise information out of a massive volume of international product regulations \u2014 with both a legal and a technical stake: steering our global compliance while supporting our engineers in product development. That\u2019s the bridge we\u2019re building with the PoC we ran with Cleo: their AI engine acts as an intelligent translator that filters noise to extract structured data, directly actionable by our teams and essential to guide design inside our PLM."',
  fr: '\u00ab Chez Decathlon, notre d\u00e9fi est de capter des informations tr\u00e8s pr\u00e9cises au milieu d\u2019un volume massif de r\u00e9glementations produits \u00e0 l\u2019international, avec un enjeu \u00e0 la fois juridique et technique\u00a0: piloter nos mises en conformit\u00e9 mondiales tout en accompagnant nos ing\u00e9nieurs dans le d\u00e9veloppement des produits. C\u2019est le pont que nous construisons avec le PoC men\u00e9 avec Cleo\u00a0: leur moteur d\u2019IA agit comme un traducteur intelligent qui filtre le bruit pour extraire une donn\u00e9e structur\u00e9e, directement exploitable par nos \u00e9quipes et indispensable pour guider la conception au sein de notre PLM. \u00bb',
};

const role = {
  en: 'Product Compliance Operations Manager at Decathlon',
  fr: 'Product Compliance Operations Manager chez Decathlon',
};

export function DecathlonQuote({ locale }: { locale: Locale }) {
  return (
    <section className="py-16 sm:py-24 px-5 sm:px-8">
      <figure className="rounded-2xl bg-white border border-[var(--color-c-border)] p-6 sm:p-10 max-w-[820px] mx-auto">
        <blockquote className="text-[clamp(1rem,1.6vw,1.25rem)] leading-[1.7] text-[var(--color-c-ink)] font-light mb-6">
          {t(locale, quote)}
        </blockquote>
        <figcaption className="flex items-center gap-4">
          <Image
            src="/philippine-tamic.jpg"
            alt="Philippine Tamic"
            width={56}
            height={56}
            className="w-14 h-14 rounded-full object-cover border border-[var(--color-c-border)]"
          />
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-semibold text-[var(--color-c-ink)]">Philippine Tamic</p>
            <p className="text-[13px] text-[rgba(0,0,0,0.62)]">{t(locale, role)}</p>
          </div>
          <Image
            src="/logos/decathlon-2024.svg"
            alt="Decathlon"
            width={110}
            height={28}
            className="h-7 w-auto opacity-80 hidden md:block"
          />
        </figcaption>
        <Link
          href={`/${locale}/customers`}
          className="group mt-6 inline-flex items-center gap-1.5 text-[14px] font-medium text-[var(--color-c-blue)] hover:gap-2.5 transition-all"
        >
          {t(locale, translations.nav.otherCases)}
          <ArrowRight weight="bold" className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </figure>
    </section>
  );
}
