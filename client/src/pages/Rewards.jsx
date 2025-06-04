import React from 'react';
import { useUser } from '../context/UserContext';
import { Tooltip } from 'react-tooltip';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import { Table, TableHeader, TableBody, TableRow, Th, Td } from '../components/Table';

// Reusable RewardCard component
const RewardCard = ({ reward, userPoints, onRedeem }) => {
  const canRedeem = userPoints >= reward.pointsCost;
  const redeemButtonClasses = `
    mt-4 w-full py-2 px-4 rounded-md text-white font-semibold transition duration-300 ease-in-out
    ${canRedeem ? 'bg-brand hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2' : 'bg-neutral-400 cursor-not-allowed'}
  `;

  return (
    <div className={`
      border border-neutral-200 rounded-lg shadow-sm p-4 flex flex-col
      ${!canRedeem ? 'opacity-70 grayscale' : 'hover:shadow-md transform transition duration-300 hover:scale-[1.02]'}
      bg-white
    `}
      role="listitem"
    >
      <img
        src={reward.imageUrl}
        alt={reward.name}
        className="w-full h-40 object-cover rounded-md mb-4 border border-neutral-100"
      />
      <h3 className="text-xl font-semibold text-neutral-900 mb-2">{reward.name}</h3>
      <p className="text-lg text-neutral-700 mb-3">Cost: <span className="font-bold text-accent-600">{reward.pointsCost} pts</span></p>
      <p className="text-sm text-neutral-500 flex-grow mb-4">{reward.description}</p>
      <button
        onClick={() => canRedeem && onRedeem(reward.id)}
        disabled={!canRedeem}
        className={redeemButtonClasses}
        data-tooltip-id={`reward-tooltip-${reward.id}`}
        data-tooltip-content={!canRedeem ? `You need ${reward.pointsCost - userPoints} more points` : ''}
        aria-label={canRedeem ? `Redeem ${reward.name}` : `Cannot redeem ${reward.name}, not enough points`}
      >
        {canRedeem ? 'Redeem' : 'Not Enough Points'}
      </button>
      {!canRedeem && <Tooltip id={`reward-tooltip-${reward.id}`} place="bottom" effect="solid" className="!bg-neutral-700 !text-white !text-sm !px-3 !py-1 !rounded-md" />}
    </div>
  );
};

export default function Rewards() {
  const { rewards, metrics, loading, error, redeemReward } = useUser();

  const handleRedeem = async (rewardId) => {
    try {
      await redeemReward(rewardId);
      // The UserContext will automatically update the points and rewards
    } catch (err) {
      console.error('Failed to redeem reward:', err);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-neutral-900">Rewards</h1>
          <p className="mt-2 text-sm text-neutral-600">
            A list of all available rewards and their requirements.
          </p>
        </div>
      </div>

      <Table>
        <TableHeader>
          <Th>Reward</Th>
          <Th>Points Required</Th>
          <Th>Status</Th>
        </TableHeader>
        <TableBody>
          {rewards.map((reward) => (
            <TableRow key={reward.id}>
              <Td>{reward.name}</Td>
              <Td>{reward.pointsRequired}</Td>
              <Td><StatusBadge status={reward.status} /></Td>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
