// /preview — internal showcase for the redesign V2 primitives.
// Open http://localhost:5173/preview (or whichever Vite port is running) to
// see every new component before it lands in the real pages.
import { useState } from 'react';
import { Droplets, IndianRupee, MapPin, Filter, Calendar, ArrowDownNarrowWide, Sparkles, Tag } from 'lucide-react';

import Header from '@/components/common/Header';
import BottomNav from '@/components/common/BottomNav';
import ListingCard from '@/components/common/ListingCard';
import {
  Button,
  ChipSelect,
  FilterCard,
  FilterPill,
  OtpInput,
  Select,
  StatTile,
  CompletionBadge,
  StickyFAB,
  MediaUploadTile,
  BottomSheet,
} from '@/components/ui';

function Section({ title, sub, children }) {
  return (
    <section className="mb-10">
      <h2 className="text-caption font-bold uppercase tracking-[0.12em] text-brand-700 mb-1">{title}</h2>
      {sub && <p className="text-caption text-surface-500 mb-3">{sub}</p>}
      <div className="rounded-2xl bg-surface-0 shadow-card p-5">{children}</div>
    </section>
  );
}

export default function PreviewPage() {
  // ChipSelect state
  const [animal, setAnimal] = useState('cow');
  const [lactation, setLactation] = useState('first');

  // FilterCard state
  const [milk, setMilk] = useState('all');
  const [price, setPrice] = useState('all');
  const [sort, setSort] = useState('recent');

  // OtpInput state
  const [otp, setOtp] = useState('');

  // Language select state (replaces the segmented toggle — Select is easier to scan
  // and the dropdown affordance is more familiar for non-power-users).
  const [lang, setLang] = useState('en');

  // Media tiles state
  const [videoFile, setVideoFile] = useState(null);
  const [udderFile, setUdderFile] = useState(null);
  const [milkingFile, setMilkingFile] = useState(null);

  // PremiumFilters bottom sheet demo
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <div className="min-h-screen pb-24 bg-surface-50">
      <Header title="Redesign Preview" showBack />

      <main className="mx-auto max-w-2xl px-4 pt-5">
        <p className="text-body-sm text-surface-600 mb-4 leading-relaxed">
          Internal showcase for the redesign V2 primitives — all components below use
          the existing emerald + warm amber brand. Tap things, they're interactive.
        </p>

        {/* Real-page nav — quick jumps to redesigned full pages */}
        <div className="mb-8 grid grid-cols-3 gap-2">
          {[
            { to: '/sell',         label: 'Sell form' },
            { to: '/profile',      label: 'Profile' },
            { to: '/edit-profile', label: 'Edit Profile' },
          ].map((p) => (
            <a
              key={p.to}
              href={p.to}
              className="text-center text-caption font-bold px-3 py-2.5 rounded-2xl bg-brand-700 text-white hover:bg-brand-800 active:scale-95 transition-all shadow-card"
            >
              {p.label}
            </a>
          ))}
        </div>

        {/* ChipSelect */}
        <Section
          title="ChipSelect"
          sub="Single-select pill row. Used for animal type, breed, lactation."
        >
          <p className="text-caption font-bold text-surface-700 mb-2">Which animal?</p>
          <ChipSelect
            value={animal}
            onChange={setAnimal}
            options={[
              { key: 'cow',     label: 'Cow' },
              { key: 'buffalo', label: 'Buffalo' },
              { key: 'bull',    label: 'Bull' },
              { key: 'goat',    label: 'Goat' },
            ]}
          />
          <p className="text-caption font-bold text-surface-700 mb-2 mt-5">Which lactation?</p>
          <ChipSelect
            value={lactation}
            onChange={setLactation}
            options={[
              { key: 'none',   label: 'Not delivered' },
              { key: 'first',  label: 'First' },
              { key: 'second', label: 'Second' },
              { key: 'other',  label: 'Other' },
            ]}
          />
          <p className="text-caption text-surface-500 mt-4">
            Selected: <code className="font-mono">{animal}</code> /{' '}
            <code className="font-mono">{lactation}</code>
          </p>
        </Section>

        {/* FilterCard + FilterPill */}
        <Section
          title="FilterCard + FilterPill"
          sub="Premium-filter grouping. One card per facet; 2-column pill grid inside."
        >
          <FilterCard
            icon={<Droplets size={22} />}
            title="Milk Capacity"
            subtitle="Feed API supported ranges included"
          >
            {[
              { key: 'all',   title: 'All Capacity', subtitle: 'All milk capacity' },
              { key: '0-5',   title: '0-5 Liters' },
              { key: '5-8',   title: '5-8 Liters' },
              { key: '8-10',  title: '8-10 Liters' },
              { key: '10-12', title: '10-12 Liters' },
              { key: '12-15', title: '12-15 Liters' },
              { key: '15-20', title: '15-20 Liters' },
              { key: '20+',   title: '20+ Liters' },
            ].map((opt) => (
              <FilterPill
                key={opt.key}
                title={opt.title}
                subtitle={opt.subtitle}
                selected={milk === opt.key}
                onClick={() => setMilk(opt.key)}
              />
            ))}
          </FilterCard>
        </Section>

        {/* OtpInput */}
        <Section
          title="OtpInput"
          sub="6-digit underline input. Used for OTP screen and the pincode field in location sheet."
        >
          <OtpInput value={otp} onChange={setOtp} length={6} />
          <p className="text-caption text-surface-500 mt-4 text-center">
            Value: <code className="font-mono">{otp || '(empty)'}</code>
          </p>
        </Section>

        {/* Language Select (matches the reference's Edit Profile "भाषा / Language" field) */}
        <Section
          title="Language Select"
          sub="Used in Edit Profile for picking display language. Native dropdown — familiar, accessible, scannable."
        >
          <label className="block text-caption font-bold text-surface-700 mb-2">
            भाषा / Language
          </label>
          <Select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
          >
            <option value="en">English</option>
            <option value="hi">हिंदी (Hindi)</option>
            <option value="mr">मराठी (Marathi)</option>
          </Select>
          <p className="text-caption text-surface-500 mt-3">
            Selected: <code className="font-mono">{lang}</code>
          </p>
        </Section>

        {/* StatTile */}
        <Section
          title="StatTile"
          sub="Two-cell stat block. Used in ListingCard for Lactation, Milk Capacity, Age, etc."
        >
          <div className="grid grid-cols-2 gap-3">
            <StatTile label="Lactation" value="1 Lactation" />
            <StatTile label="Milk Capacity" value="10 L/day" />
            <StatTile label="Age" value="3 years" />
            <StatTile label="Breed" value="Jersey Cross" />
          </div>
        </Section>

        {/* CompletionBadge */}
        <Section
          title="CompletionBadge"
          sub="Amber pill surfacing profile-completion gaps."
        >
          <div className="flex flex-wrap gap-3">
            <CompletionBadge percent={10} />
            <CompletionBadge percent={40} />
            <CompletionBadge percent={70} />
            <CompletionBadge percent={90} />
          </div>
        </Section>

        {/* MediaUploadTile */}
        <Section
          title="MediaUploadTile"
          sub="Dashed-border upload box. Used in the Sell form for video / udder photo / milking video."
        >
          <div className="grid grid-cols-2 gap-3">
            <MediaUploadTile
              kind="video"
              label="Select video"
              file={videoFile}
              onFile={setVideoFile}
            />
            <MediaUploadTile
              kind="photo"
              label="Select udder photo"
              file={udderFile}
              onFile={setUdderFile}
            />
            <MediaUploadTile
              kind="video"
              label="Add milking video"
              fullWidth
              file={milkingFile}
              onFile={setMilkingFile}
            />
          </div>
        </Section>

        {/* PremiumFilters preview via bottom sheet */}
        <Section
          title="Premium Filters preview"
          sub="Mini end-to-end demo combining FilterCard + FilterPill in the BottomSheet primitive."
        >
          <Button onClick={() => setFiltersOpen(true)} fullWidth leftIcon={Filter}>
            Open Premium Filters
          </Button>
        </Section>

        {/* ListingCard */}
        <Section
          title="ListingCard"
          sub="The rich animal card. Photo carousel, time-ago, price, location, stats, seller block with icon-only Call + WhatsApp."
        >
          <div className="space-y-4">
            <ListingCard
              id="demo-1"
              title="HOLSTEIN FRIESIAN"
              type="Cow"
              price={35000}
              isNegotiable
              location="Idrishpur"
              distanceKm={110}
              lactationLabel="1 Lactation"
              milkPerDay={10}
              images={[
                'https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=900&q=70&auto=format',
                'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=900&q=70&auto=format',
                'https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?w=900&q=70&auto=format',
              ]}
              sellerName="Deepak"
              sellerPhone="9876543210"
              createdAt={new Date(Date.now() - 15 * 60 * 1000).toISOString()}
              onFlag={() => {}}
              onShare={() => {}}
            />
            <ListingCard
              id="demo-2"
              title="MURRAH"
              type="Buffalo"
              price={85000}
              isNegotiable
              location="Rithal Phogat"
              distanceKm={87}
              lactationLabel="2 Lactation"
              milkPerDay={13}
              images={[
                'https://images.unsplash.com/photo-1605132949454-9f9b3ee7f3d3?w=900&q=70&auto=format',
              ]}
              sellerName="Mohit Phal"
              sellerPhone="9123456780"
              createdAt={new Date(Date.now() - 17 * 60 * 1000).toISOString()}
              onFlag={() => {}}
              onShare={() => {}}
            />
            <ListingCard
              id="demo-3"
              title="SAHIWAL"
              type="Cow"
              price={62000}
              location="Nashik"
              distanceKm={42}
              lactationLabel="3 Lactation"
              milkPerDay={14}
              sellerName="Ramesh"
              sellerPhone="9988776655"
              createdAt={new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()}
              onFlag={() => {}}
              onShare={() => {}}
            />
          </div>
        </Section>

        <p className="text-caption text-center text-surface-400 mt-8 mb-4">
          Header above and BottomNav below are also part of the redesign — both already in place.
        </p>
      </main>

      <BottomNav />

      <StickyFAB to="/sell" icon="🐄">
        Sell Livestock
      </StickyFAB>

      <BottomSheet
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="Premium Filters"
        footer={
          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" onClick={() => { setPrice('all'); setSort('recent'); setMilk('all'); }}>
              Reset
            </Button>
            <Button onClick={() => setFiltersOpen(false)}>Apply</Button>
          </div>
        }
      >
        <p className="text-body-sm text-surface-500 mb-5">Choose right animals quickly without typing</p>
        <div className="space-y-4">
          <FilterCard
            icon={<Sparkles size={22} />}
            title="Choose Animal"
            subtitle="Like outside quick cards"
          >
            {[
              { key: 'all',     title: 'All Animals', subtitle: 'All kinds' },
              { key: 'cow',     title: 'Cow',          subtitle: 'Dairy and milking cows' },
              { key: 'buffalo', title: 'Buffalo',      subtitle: 'High fat milk' },
              { key: 'other',   title: 'Other',        subtitle: 'Other animals' },
            ].map((opt) => (
              <FilterPill
                key={opt.key}
                title={opt.title}
                subtitle={opt.subtitle}
                selected={false}
                onClick={() => {}}
              />
            ))}
          </FilterCard>

          <FilterCard
            icon={<IndianRupee size={22} />}
            title="Price"
            subtitle="No typing needed, choose budget ranges directly"
          >
            {[
              { key: 'all',     title: 'All Budget',      subtitle: 'Every price' },
              { key: '0-20',    title: '₹0-₹20 Thousand' },
              { key: '20-50',   title: '₹20-₹50 Thousand' },
              { key: '50-80',   title: '₹50-₹80 Thousand' },
              { key: '80-99',   title: '₹80-₹99 Thousand' },
              { key: '1-1.5L',  title: '₹1-₹1.5 Lakh' },
              { key: '1.5L+',   title: '₹1.5+ Lakh' },
            ].map((opt) => (
              <FilterPill
                key={opt.key}
                title={opt.title}
                subtitle={opt.subtitle}
                selected={price === opt.key}
                onClick={() => setPrice(opt.key)}
              />
            ))}
          </FilterCard>

          <FilterCard
            icon={<MapPin size={22} />}
            title="Distance & Location"
            subtitle="Choose preferred distance to view nearby animals"
          >
            {['Nearby', '25 km', '50 km', '100 km', '200 km', 'Any'].map((label) => (
              <FilterPill key={label} title={label} selected={false} onClick={() => {}} />
            ))}
          </FilterCard>

          <FilterCard
            icon={<Tag size={22} />}
            title="Lactation Stage"
            subtitle="Shortlist by lactation stage"
          >
            {['All Lactations', 'Not Delivered', '1st Lactation', '2nd Lactation', '3rd Lactation', '4th+ Lactation'].map((label) => (
              <FilterPill key={label} title={label} selected={false} onClick={() => {}} />
            ))}
          </FilterCard>

          <FilterCard
            icon={<Calendar size={22} />}
            title="When Animal Listed"
            subtitle="Choose new or recent animals first"
            columns={1}
          >
            {[
              { key: 'any',  title: 'Anytime',     subtitle: 'Every animal' },
              { key: '1h',   title: '1 Hour Ago',  subtitle: 'Fresh animals' },
              { key: '1d',   title: '1 Day Ago',   subtitle: "Today's animals" },
              { key: '2d',   title: '2 Days Ago',  subtitle: 'Recent animals' },
            ].map((opt) => (
              <FilterPill
                key={opt.key}
                title={opt.title}
                subtitle={opt.subtitle}
                selected={false}
                onClick={() => {}}
              />
            ))}
          </FilterCard>

          <FilterCard
            icon={<ArrowDownNarrowWide size={22} />}
            title="Sort & Additional Options"
            subtitle="Set order of animals shown and deal conditions"
          >
            {[
              { key: 'recent',   title: 'Most Recent', subtitle: 'New animals first' },
              { key: 'low',      title: 'Low Price',   subtitle: 'Cheapest first' },
              { key: 'nearest',  title: 'Nearest',     subtitle: 'Nearby first' },
              { key: 'farthest', title: 'Farthest',    subtitle: 'Far first' },
            ].map((opt) => (
              <FilterPill
                key={opt.key}
                title={opt.title}
                subtitle={opt.subtitle}
                selected={sort === opt.key}
                onClick={() => setSort(opt.key)}
              />
            ))}
          </FilterCard>
        </div>
      </BottomSheet>
    </div>
  );
}
