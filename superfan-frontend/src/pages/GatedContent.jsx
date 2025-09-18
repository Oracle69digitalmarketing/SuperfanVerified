if (error.includes("XION Dave verification required")) {
  return (
    <div>
      <p>🔒 This content requires XION Dave verification.</p>
      <ConnectXionDaveButton
        userId={user._id}
        onVerified={() => window.location.reload()}
      />
    </div>
  );
}
