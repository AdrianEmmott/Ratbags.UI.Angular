// implemeneted by components that need to show a
// "hey you have unsaved changes - discard or stay?" prompt,
// when they navigate away before saving
//
// it's also used by the guard as its way of 'peeking' into the component's exposed methods (canDeactivate and editFinished?)
export interface CanComponentDeactivate {
  canDeactivate: () => boolean | Promise<boolean>;
  editFinished?: () => void;  // if needed for specific components
}
