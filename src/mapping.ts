import {
  LocationDrop as LocationContract,
  LocationUpdated,
  UserUpdated,
  DropMinted,
  DropClaimed,
  ProofCreated
} from "../generated/LocationDrop/LocationDrop"
import { Location, Proof, User, Drop } from "../generated/schema"

export function handleLocationUpdated(event: LocationUpdated): void {
  const contract = LocationContract.bind(event.address)
  const location = contract.getLocation(event.params.locationId)

  const entity = new Location(event.params.locationId.toString())
  entity.lat = location.lat
  entity.lon = location.lon
  entity.nS = location.nS
  entity.eW = location.eW
  entity.name = location.name
  entity.description = location.description
  entity.imageUrl = location.imageUrl
  entity.verified = location.verified
  entity.hide = location.hide

  entity.save()
}

export function handleUserUpdated(event: UserUpdated): void {
  const contract = LocationContract.bind(event.address)
  const user = contract.getUser(event.params.user)

  const entity = new User(event.params.user.toHexString())
  entity.lastBlockAwarded = user.lastBlockAwarded
  entity.dropPoints = user.dropPoints
  entity.save()
}

export function handleDropMinted(event: DropMinted): void {
  const contract = LocationContract.bind(event.address)
  const drop = contract.getDrop(event.params.dropId)

  const entity = new Drop(event.params.dropId.toString())
  entity.message = drop.message
  entity.user = drop.user
  entity.verifier = drop.verifier
  entity.blockNumber = drop.blockNumber
  entity.locationId = drop.locationId
  entity.save()
}

export function handleDropClaimed(event: DropClaimed): void {
  const entity = Drop.load(event.params.dropId.toString())
  if (entity) {
    entity.verifier = event.params.user
    entity.save();
  }
}

export function handleProofCreated(event: ProofCreated): void {
  const entity = new Proof(event.transaction.hash.toHexString());
  entity.proofUri = event.params.proofUri;
  entity.user = event.params.user;
  entity.dropId = event.params.dropId;
  entity.save();
}

