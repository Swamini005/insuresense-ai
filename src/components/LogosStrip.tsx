import React from 'react'
import { motion } from 'framer-motion'

type Company = {
  name: string
  logo: string
}

const companies: Company[] = [
  {
    name: 'Ecosure Pulpmolding Technologies',
    logo:
      'https://d1f4abmpnfzs14.cloudfront.net/pe/asset/logo_mark/INE0K3N01021/logo_mark_v1762004170092.png?w=64&q=75',
  },
  {
    name: 'Goa Shipyard',
    logo:
      'https://d1f4abmpnfzs14.cloudfront.net/pe/asset/logo_mark/INE178Z01013/logo_mark_v1762004075874.png?w=64&q=75',
  },
  {
    name: 'Goodluck Defence and Aerospace',
    logo:
      'https://d1f4abmpnfzs14.cloudfront.net/pe/asset/logo_mark/INE0S7401019/logo_mark_v1762004107159.png?w=64&q=75',
  },
  {
    name: 'Motilal Oswal Home Finance',
    logo:
      'https://d1f4abmpnfzs14.cloudfront.net/pe/asset/logo_mark/INE658R01011/logomark_251222170948.png?w=64&q=75',
  },
  {
    name: 'National Stock Exchange (NSE)',
    logo:
      'https://d1f4abmpnfzs14.cloudfront.net/pe/asset/logo_mark/INE721I01024/logo_mark_v1762004462574.png?w=64&q=75',
  },
  {
    name: 'NCL Buildtek',
    logo:
      'https://d1f4abmpnfzs14.cloudfront.net/pe/asset/logo_mark/INE243S01010/logo_mark_v1762004392308.png?w=64&q=75',
  },
  {
    name: 'Oravel Stays (OYO Rooms)',
    logo:
      'https://d1f4abmpnfzs14.cloudfront.net/pe/asset/logo_mark/INE561T01021/logo_mark_v1762004362296.png?w=64&q=75',
  },
  {
    name: 'Parag Parikh Financial',
    logo:
      'https://d1f4abmpnfzs14.cloudfront.net/pe/asset/logo_mark/INE0FGC01012/logo_mark_v1762004403557.png?w=64&q=75',
  },
  {
    name: 'PNB Finance & Industries',
    logo:
      'https://d1f4abmpnfzs14.cloudfront.net/pe/asset/logo_mark/INE057F01011/logo_mark_v1762004325684.png?w=64&q=75',
  },
  {
    name: 'Schneider Electric President Systems',
    logo:
      'https://d1f4abmpnfzs14.cloudfront.net/pe/asset/logo_mark/INE155D01018/logo_mark_v1762004095475.png?w=64&q=75',
  },
  {
    name: 'Signify Innovations',
    logo:
      'https://d1f4abmpnfzs14.cloudfront.net/pe/asset/logo_mark/INE045U01015/logo_mark_v1762004480448.png?w=64&q=75',
  },
  {
    name: 'Sri Sarvaraya Sugars',
    logo:
      'https://d1f4abmpnfzs14.cloudfront.net/pe/asset/logo_mark/INE658W01011/logo_mark_v1762004122403.png?w=64&q=75',
  },
    { name: 'HDFC AMC', logo: 'https://logo.clearbit.com/hdfcfund.com' },
  { name: 'ICICI Securities', logo: 'https://logo.clearbit.com/icicisecurities.com' },
  { name: 'Motilal Oswal', logo: 'https://logo.clearbit.com/motilaloswal.com' },
  { name: 'Zerodha', logo: 'https://logo.clearbit.com/zerodha.com' },
  { name: 'Groww', logo: 'https://logo.clearbit.com/groww.in' },
  { name: 'Angel One', logo: 'https://logo.clearbit.com/angelone.in' },
  { name: 'Upstox', logo: 'https://logo.clearbit.com/upstox.com' },
  { name: 'Paytm Money', logo: 'https://logo.clearbit.com/paytmmoney.com' },
  { name: 'Nippon India Mutual Fund', logo: 'https://logo.clearbit.com/nipponindiaim.com' },
  { name: 'Axis Mutual Fund', logo: 'https://logo.clearbit.com/axismf.com' },
]

const CompanyCard: React.FC<{ company: Company }> = ({ company }) => (
  <motion.div
    className="flex items-center gap-4 bg-white border border-gray-200 rounded-full px-5 py-3 flex-shrink-0 shadow-sm hover:shadow-md hover:border-purple-200 transition-all duration-300"
    whileHover={{
      scale: 1.05,
      rotate: 1,
    }}
    whileTap={{
      scale: [0.98, 1.02, 1],
      rotate: [0, -2, 0],
      transition: {
        duration: 0.3,
        times: [0, 0.6, 1],
        type: "spring",
        stiffness: 300,
        damping: 15,
        mass: 1,
      },
    }}
    transition={{
      type: "spring",
      stiffness: 300,
      damping: 15,
      mass: 1,
    }}
  >
    <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden bg-gray-50 border border-gray-100">
      <img
        src={company.logo}
        alt={company.name}
        className="w-full h-full object-contain p-1.5"
        onError={(e) => {
          const t = e.target as HTMLImageElement
          t.style.opacity = '0.25'
        }}
      />
    </div>
    <span className="text-gray-700 font-medium text-sm whitespace-nowrap pr-2">{company.name}</span>
  </motion.div>
)

const LogoStrip: React.FC<{ direction?: 'left' | 'right'; speed?: number }> = ({ direction = 'left', speed = 40 }) => {
  const extendedCompanies = [...companies, ...companies, ...companies]

  return (
    <div className="relative overflow-hidden py-3 h-1/3 flex items-center" role="marquee" aria-label="Trusted partner companies">
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" aria-hidden="true" />

      <motion.div
        className="flex gap-4 items-center"
        animate={{
          x: direction === 'left' ? ['0%', '-33.33%'] : ['-33.33%', '0%'],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: speed,
            ease: 'linear',
          },
        }}
      >
        {extendedCompanies.map((company, idx) => (
          <CompanyCard key={`${company.name}-${idx}`} company={company} />
        ))}
      </motion.div>
    </div>
  )
}

export default function LogosStrip() {
  return (
    <div className="w-full">
      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
        <div className="flex flex-col gap-1">
          <LogoStrip direction="left" speed={45} />
          <LogoStrip direction="right" speed={50} />
          <LogoStrip direction="left" speed={42} />
          <LogoStrip direction="right" speed={48} />
        </div>
      </div>
    </div>
  )
}
