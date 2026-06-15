import AgentCard from './AgentCard'

const AGENT_ROLES = ['critic', 'optimist', 'pragmatist']

export default function AgentGrid({ agents = ['', '', ''], streaming = [false, false, false] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
      {AGENT_ROLES.map((role, index) => (
        <AgentCard
          key={role}
          role={role}
          text={agents[index] ?? ''}
          isStreaming={streaming[index] ?? false}
        />
      ))}
    </div>
  )
}
