// MainApp.tsx
// ...
const MainApp = () => {
  const { account, isConnected, isConnecting } = useAbstraxionAccount();
  const { showModal, hideModal } = useModal(); // Use hideModal if you need to close it programmatically

  const handleWalletAction = () => {
    if (!isConnected) {
      showModal(); // The function signature might be different, check the SDK docs for `showModal`
    }
  };

  return (
    <>
      <Abstraxion />
      <View style={styles.container}>
        {/* Your UI logic here */}
      </View>
    </>
  );
};

