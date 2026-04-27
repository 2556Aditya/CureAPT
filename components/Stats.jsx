const stats = [
    { id: 1, name: 'Active Health Streaks', value: '1.2 million' },
    { id: 2, name: 'Wellness Goals Achieved', value: '8.5 million' },
    { id: 3, name: 'Active Monthly Users', value: '750,000' },
  ]
  
  export default function Stats() {
    return (
      <div className=" py-7 sm:py-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.id} className="mx-auto flex max-w-xs flex-col gap-y-4">
                <dt className="text-base/7 text-gray-400">{stat.name}</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    )
  }